/**
 * Telegram Bot API — Direct fetch-based implementation (no library needed)
 * Uses the Telegram Bot HTTP API: https://core.telegram.org/bots/api
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const CHANNEL_CHAT_ID = process.env.TELEGRAM_CHANNEL_CHAT_ID!;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://bezisstore.vercel.app');

const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

/**
 * Generic helper to call any Telegram Bot API method
 */
/**
 * Generic helper to call any Telegram Bot API method
 */
export async function telegramAPI(method: string, body: Record<string, unknown>) {
  const res = await fetch(`${TELEGRAM_API}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!data.ok) {
    console.error(`Telegram API error [${method}]:`, data);
    throw new Error(`Telegram API error: ${data.description || 'Unknown error'}`);
  }

  return data.result;
}

/**
 * Resolves an image URL. If the URL points to a web page (like Pinterest or a shortener),
 * it fetches the page and extracts the Open Graph image URL.
 */
export async function resolveImageUrl(url: string): Promise<string> {
  const lowerUrl = url.toLowerCase();
  // If it's a direct image link format, we can skip fetching
  if (
    lowerUrl.endsWith('.jpg') ||
    lowerUrl.endsWith('.jpeg') ||
    lowerUrl.endsWith('.png') ||
    lowerUrl.endsWith('.gif') ||
    lowerUrl.endsWith('.webp')
  ) {
    return url;
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    const contentType = res.headers.get('content-type') || '';
    if (contentType.startsWith('image/')) {
      return res.url;
    }

    const html = await res.text();
    const metaTags = html.match(/<meta[^>]+>/gi) || [];
    for (const tag of metaTags) {
      const isOgImage = /property=["']og:image["']/i.test(tag) || /name=["']og:image["']/i.test(tag);
      if (isOgImage) {
        const contentMatch = tag.match(/content=["']([^"']+)["']/i);
        if (contentMatch && contentMatch[1]) {
          return contentMatch[1].replace(/&amp;/g, '&');
        }
      }
    }
  } catch (err) {
    console.error('[resolveImageUrl] Failed to resolve image URL:', err);
  }

  return url;
}

/**
 * Post a product to the Telegram CHANNEL with an "Order Now" button
 */
export async function postProductToChannel(product: {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  imageUrl: string;
}) {
  const caption = [
    `🛍️ <b>${escapeHtml(product.name)}</b>`,
    ``,
    product.description ? `📝 ${escapeHtml(product.description)}` : null,
    `💰 ዋጋ: <b>${product.price.toLocaleString()} ብር</b>`,
    ``,
    `👇 ለማዘዝ ከታች ያለውን ይጫኑ!`,
  ]
    .filter(Boolean)
    .join('\n');

  const resolvedPhoto = await resolveImageUrl(product.imageUrl);

  const result = await telegramAPI('sendPhoto', {
    chat_id: CHANNEL_CHAT_ID,
    photo: resolvedPhoto,
    caption,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🛒 አሁን እዘዝ',
            url: `${APP_URL}/order/${product.id}`,
          },
        ],
      ],
    },
  });

  return result.message_id;
}

/**
 * Send an order notification to the admin's private Telegram chat
 */
export async function notifyAdminNewOrder(order: {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  quantity: number;
  totalPrice: number;
  productName: string;
  note?: string | null;
}) {
  const message = [
    `🔔 <b>አዲስ ትዕዛዝ ደርሷል!</b>`,
    ``,
    `📦 <b>ምርት:</b> ${escapeHtml(order.productName)}`,
    `🔢 <b>ብዛት:</b> ${order.quantity}`,
    `💰 <b>ጠቅላላ ዋጋ:</b> ${order.totalPrice.toLocaleString()} ብር`,
    ``,
    `👤 <b>ደንበኛ:</b> ${escapeHtml(order.customerName)}`,
    `📞 <b>ስልክ ቁጥር:</b> ${escapeHtml(order.customerPhone)}`,
    `📍 <b>አድራሻ:</b> ${escapeHtml(order.customerAddress)}`,
    order.note ? `📝 <b>ማስታወሻ:</b> ${escapeHtml(order.note)}` : null,
    ``,
    `🆔 የትዕዛዝ መለያ ቁጥር: <code>${order.id}</code>`,
    ``,
    `👉 <a href="${APP_URL}/admin/orders/${order.id}">በዳሽቦርድ ይመልከቱ</a>`,
  ]
    .filter(Boolean)
    .join('\n');

  await telegramAPI('sendMessage', {
    chat_id: ADMIN_CHAT_ID,
    text: message,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '✅ አረጋግጥ', callback_data: `confirm_${order.id}` },
          { text: '❌ ሰርዝ', callback_data: `cancel_${order.id}` },
        ],
      ],
    },
  });
}

/**
 * Notify admin when order status changes
 */
export async function notifyAdminStatusUpdate(
  orderId: string,
  status: string,
  customerName: string
) {
  const emoji: Record<string, string> = {
    CONFIRMED: '✅',
    PROCESSING: '⚙️',
    DELIVERED: '🎉',
    CANCELLED: '❌',
  };

  const amharicStatus: Record<string, string> = {
    PENDING: 'በመጠባበቅ ላይ',
    CONFIRMED: 'የተረጋገጠ',
    PROCESSING: 'በማዘጋጀት ላይ',
    DELIVERED: 'የደረሰ',
    CANCELLED: 'የተሰረዘ',
  };

  const statusText = amharicStatus[status] || status;

  await telegramAPI('sendMessage', {
    chat_id: ADMIN_CHAT_ID,
    text: `${emoji[status] || '📋'} የደንበኛ <b>${escapeHtml(customerName)}</b> ትዕዛዝ <b>${escapeHtml(orderId)}</b> ወደ <b>${statusText}</b> ተቀይሯል።`,
    parse_mode: 'HTML',
  });
}

/**
 * Answer a callback query from an inline keyboard button click
 */
export async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  await telegramAPI('answerCallbackQuery', {
    callback_query_id: callbackQueryId,
    text,
  });
}

/**
 * Edit a message's text (useful for updating inline keyboards and status)
 */
export async function editMessageText(
  chatId: string | number,
  messageId: number,
  text: string,
  options?: Record<string, unknown>
) {
  return await telegramAPI('editMessageText', {
    chat_id: chatId,
    message_id: messageId,
    text,
    ...options,
  });
}

/**
 * Escape special characters for Telegram Markdown
 */
export function escapeMarkdown(text: string): string {
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
}

/**
 * Escape special characters for Telegram HTML parse mode
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
