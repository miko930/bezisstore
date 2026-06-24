import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { postProductToChannel } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  const { productId } = await req.json();

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const messageId = await postProductToChannel(product);

  // Save the Telegram message ID so we can edit/delete later
  await prisma.product.update({
    where: { id: productId },
    data: { telegramMessageId: String(messageId) },
  });

  return NextResponse.json({ success: true, messageId });
}
