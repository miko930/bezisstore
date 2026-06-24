/**
 * Telegram Bot API — Direct fetch-based implementation (no library needed)
 * Uses the Telegram Bot HTTP API: https://core.telegram.org/bots/api
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const CHANNEL_CHAT_ID = process.env.TELEGRAM_CHANNEL_CHAT_ID!;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

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
    `🛍️ *${escapeMarkdown(product.name)}*`,
    ``,
    product.description ? `📝 ${escapeMarkdown(product.description)}` : null,
    `💰 Price: *${product.price.toLocaleString()} ETB*`,
    ``,
    `👇 Tap below to order now!`,
  ]
    .filter(Boolean)
    .join('\n');

  const result = await telegramAPI('sendPhoto', {
    chat_id: CHANNEL_CHAT_ID,
    photo: product.imageUrl,
    caption,
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🛒 Order Now',
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
    `🔔 *New Order Received\\!*`,
    ``,
    `📦 *Product:* ${escapeMarkdown(order.productName)}`,
    `🔢 *Qty:* ${order.quantity}`,
    `💰 *Total:* ${order.totalPrice.toLocaleString()} ETB`,
    ``,
    `👤 *Customer:* ${escapeMarkdown(order.customerName)}`,
    `📞 *Phone:* ${escapeMarkdown(order.customerPhone)}`,
    `📍 *Address:* ${escapeMarkdown(order.customerAddress)}`,
    order.note ? `📝 *Note:* ${escapeMarkdown(order.note)}` : null,
    ``,
    `🆔 Order ID: \`${order.id}\``,
    ``,
    `👉 [View in Dashboard](${APP_URL}/admin/orders/${order.id})`,
  ]
    .filter(Boolean)
    .join('\n');

  await telegramAPI('sendMessage', {
    chat_id: ADMIN_CHAT_ID,
    text: message,
    parse_mode: 'MarkdownV2',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '✅ Confirm Order', callback_data: `confirm_${order.id}` },
          { text: '❌ Cancel Order', callback_data: `cancel_${order.id}` },
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

  await telegramAPI('sendMessage', {
    chat_id: ADMIN_CHAT_ID,
    text: `${emoji[status] || '📋'} Order *${orderId}* for *${escapeMarkdown(customerName)}* updated to *${status}*`,
    parse_mode: 'Markdown',
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

