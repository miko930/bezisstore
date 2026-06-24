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
        await answerCallbackQuery(callbackQuery.id, '⚠️ Unauthorized: You are not the admin!');
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
          await answerCallbackQuery(callbackQuery.id, '❌ Order not found in database!');
          return NextResponse.json({ ok: true });
        }

        // Update status in DB
        await prisma.order.update({
          where: { id: orderId },
          data: { status: action },
        });

        // Answer callback query so Telegram loader stops
        await answerCallbackQuery(callbackQuery.id, `Order ${action === 'CONFIRMED' ? 'Confirmed' : 'Cancelled'}!`);

        // Edit the Telegram message to reflect the new status and remove the buttons
        const emoji = action === 'CONFIRMED' ? '✅' : '❌';
        const dateStr = new Date().toLocaleString();
        
        // Reconstruct the message with the status update
        const originalText = message.text || '';
        const updatedText = `${originalText}\n\n${emoji} *Order Status:* ${action}\n📅 *Updated At:* ${escapeMarkdown(dateStr)}`;

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
              `👋 *Welcome to the Shop Admin Bot\\!*`,
              ``,
              `You can manage and view shop data directly from Telegram using these commands:`,
              `📊 /stats \\- View overall shop statistics`,
              `📦 /orders \\- View recent pending/confirmed orders`,
              `🛍️ /products \\- View in\\-stock products`,
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
              `📊 *Shop Statistics*`,
              `──────────────────`,
              `🛍️ *Total Products:* ${totalProducts}`,
              `📦 *Total Orders:* ${totalOrders}`,
              `⏳ *Pending Orders:* ${pendingOrders}`,
              `💰 *Total Revenue:* ${revenue.toLocaleString()} ETB`,
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
              text: '📭 No orders found in the database.',
            });
            return NextResponse.json({ ok: true });
          }

          const orderLines = recentOrders.map((o) => {
            const statusEmoji = o.status === 'PENDING' ? '⏳' : o.status === 'CONFIRMED' ? '✅' : o.status === 'DELIVERED' ? '🎉' : '❌';
            return `${statusEmoji} *Order:* ${escapeMarkdown(o.product.name)} (x${o.quantity})\n👤 *Customer:* ${escapeMarkdown(o.customerName)}\n💰 *Total:* ${o.totalPrice.toLocaleString()} ETB\n📍 *Address:* ${escapeMarkdown(o.customerAddress)}\n⏱️ *Status:* ${o.status}\n`;
          });

          await telegramAPI('sendMessage', {
            chat_id: chat.id,
            text: `📦 *Recent Orders*\n──────────────────\n\n${orderLines.join('\n──────────────────\n\n')}`,
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
              text: '📭 No products found. Add products from the dashboard!',
            });
            return NextResponse.json({ ok: true });
          }

          const productLines = products.map((p) => {
            return `🛍️ *${escapeMarkdown(p.name)}*\n💰 Price: ${p.price.toLocaleString()} ETB\n📦 Stock: ${p.inStock ? 'In Stock' : 'Out of Stock'}`;
          });

          await telegramAPI('sendMessage', {
            chat_id: chat.id,
            text: `🛍️ *Recent Products*\n──────────────────\n\n${productLines.join('\n\n')}`,
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
