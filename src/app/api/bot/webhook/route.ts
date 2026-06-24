import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  answerCallbackQuery,
  editMessageText,
  telegramAPI,
  escapeMarkdown,
} from '@/lib/telegram';

const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID!;

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();

    // 1. Handle Inline Button Click (Callback Queries)
    if (update.callback_query) {
      const callbackQuery = update.callback_query;
      const data = callbackQuery.data; // e.g., 'confirm_cuid' or 'cancel_cuid'
      const fromId = String(callbackQuery.from.id);
      const message = callbackQuery.message;

      // Only authorize admin to perform action
      if (fromId !== ADMIN_CHAT_ID) {
        await answerCallbackQuery(callbackQuery.id, '⚠️ ፈቃድ የለዎትም: እርስዎ አድሚን አይደሉም!');
        return NextResponse.json({ ok: true });
      }

      if (data.startsWith('confirm_') || data.startsWith('cancel_')) {
        const action = data.startsWith('confirm_') ? 'CONFIRMED' : 'CANCELLED';
        const orderId = data.replace(data.startsWith('confirm_') ? 'confirm_' : 'cancel_', '');

        // Verify order exists
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: { product: true },
        });

        if (!order) {
          await answerCallbackQuery(callbackQuery.id, '❌ ትዕዛዙ በዳታቤዝ ውስጥ አልተገኘም!');
          return NextResponse.json({ ok: true });
        }

        // Update status in DB
        await prisma.order.update({
          where: { id: orderId },
          data: { status: action },
        });

        // Answer callback query so Telegram loader stops
        await answerCallbackQuery(callbackQuery.id, `ትዕዛዝ ${action === 'CONFIRMED' ? 'ተረጋግጧል' : 'ተሰርዟል'}!`);

        // Edit the Telegram message to reflect the new status and remove the buttons
        const emoji = action === 'CONFIRMED' ? '✅' : '❌';
        const dateStr = new Date().toLocaleString();
        
        // Reconstruct the message with the status update
        const originalText = message.text || '';
        const amharicAction = action === 'CONFIRMED' ? 'የተረጋገጠ' : 'የተሰረዘ';
        const updatedText = `${originalText}\n\n${emoji} *የትዕዛዝ ሁኔታ:* ${amharicAction}\n📅 *የተሻሻለበት ቀን:* ${escapeMarkdown(dateStr)}`;

        await editMessageText(message.chat.id, message.message_id, updatedText, {
          parse_mode: 'Markdown',
          reply_markup: { inline_keyboard: [] }, // removes the confirm/cancel buttons
        });
      }

      return NextResponse.json({ ok: true });
    }

    // 2. Handle Text Commands from Admin
    if (update.message && update.message.text) {
      const chat = update.message.chat;
      const text = update.message.text.trim();
      const fromId = String(update.message.from.id);

      // Only respond to the admin for commands
      if (fromId === ADMIN_CHAT_ID) {
        if (text === '/start') {
          await telegramAPI('sendMessage', {
            chat_id: chat.id,
            text: [
              `👋 *እንኳን ወደ ሱቅ አስተዳዳሪ ቦት በደህና መጡ\!*`,
              ``,
              `በእነዚህ ትዕዛዞች በመጠቀም የሱቅዎን መረጃዎች በቀጥታ ከቴሌግራም ማስተዳደር እና ማየት ይችላሉ:`,
              `📊 /stats \\- አጠቃላይ የሱቅ ስታቲስቲክስን ይመልከቱ`,
              `📦 /orders \\- የቅርብ ጊዜ ትዕዛዞችን ይመልከቱ`,
              `🛍️ /products \\- በክምችት ላይ ያሉ ምርቶችን ይመልከቱ`,
            ].join('\n'),
            parse_mode: 'MarkdownV2',
          });
        } else if (text === '/stats') {
          const [totalOrders, pendingOrders, totalRevenue, totalProducts] = await Promise.all([
            prisma.order.count(),
            prisma.order.count({ where: { status: 'PENDING' } }),
            prisma.order.aggregate({
              _sum: { totalPrice: true },
              where: { status: { not: 'CANCELLED' } },
            }),
            prisma.product.count(),
          ]);

          const revenue = totalRevenue._sum.totalPrice ?? 0;

          await telegramAPI('sendMessage', {
            chat_id: chat.id,
            text: [
              `📊 *የሱቅ ስታቲስቲክስ*`,
              `──────────────────`,
              `🛍️ *ጠቅላላ ምርቶች:* ${totalProducts}`,
              `📦 *ጠቅላላ ትዕዛዞች:* ${totalOrders}`,
              `⏳ *በመጠባበቅ ላይ ያሉ ትዕዛዞች:* ${pendingOrders}`,
              `💰 *ጠቅላላ ገቢ:* ${revenue.toLocaleString()} ብር`,
            ].join('\n'),
            parse_mode: 'Markdown',
          });
        } else if (text === '/orders') {
          const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { product: true },
          });

          if (recentOrders.length === 0) {
            await telegramAPI('sendMessage', {
              chat_id: chat.id,
              text: '📭 በዳታቤዝ ውስጥ ምንም ትዕዛዝ አልተገኘም።',
            });
            return NextResponse.json({ ok: true });
          }

          const amharicStatus: Record<string, string> = {
            PENDING: 'በመጠባበቅ ላይ',
            CONFIRMED: 'የተረጋገጠ',
            PROCESSING: 'በማዘጋጀት ላይ',
            DELIVERED: 'የደረሰ',
            CANCELLED: 'የተሰረዘ',
          };

          const orderLines = recentOrders.map((o) => {
            const statusEmoji = o.status === 'PENDING' ? '⏳' : o.status === 'CONFIRMED' ? '✅' : o.status === 'DELIVERED' ? '🎉' : '❌';
            const statusText = amharicStatus[o.status] || o.status;
            return `${statusEmoji} *ምርት:* ${escapeMarkdown(o.product.name)} (x${o.quantity})\n👤 *ደንበኛ:* ${escapeMarkdown(o.customerName)}\n💰 *ጠቅላላ:* ${o.totalPrice.toLocaleString()} ብር\n📍 *አድራሻ:* ${escapeMarkdown(o.customerAddress)}\n⏱️ *ሁኔታ:* ${statusText}\n`;
          });

          await telegramAPI('sendMessage', {
            chat_id: chat.id,
            text: `📦 *የቅርብ ጊዜ ትዕዛዞች*\n──────────────────\n\n${orderLines.join('\n──────────────────\n\n')}`,
            parse_mode: 'Markdown',
          });
        } else if (text === '/products') {
          const products = await prisma.product.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
          });

          if (products.length === 0) {
            await telegramAPI('sendMessage', {
              chat_id: chat.id,
              text: '📭 ምንም ምርቶች አልተገኙም። እባክዎን ከዳሽቦርዱ ላይ ምርት ይጨምሩ!',
            });
            return NextResponse.json({ ok: true });
          }

          const productLines = products.map((p) => {
            return `🛍️ *${escapeMarkdown(p.name)}*\n💰 ዋጋ: ${p.price.toLocaleString()} ብር\n📦 ክምችት: ${p.inStock ? 'ክምችት አለ' : 'ክምችት አልቋል'}`;
          });

          await telegramAPI('sendMessage', {
            chat_id: chat.id,
            text: `🛍️ *የቅርብ ጊዜ ምርቶች*\n──────────────────\n\n${productLines.join('\n\n')}`,
            parse_mode: 'Markdown',
          });
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
