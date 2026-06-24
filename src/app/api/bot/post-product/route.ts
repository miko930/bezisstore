import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { postProductToChannel } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    console.log('[post-product] Posting product to Telegram:', {
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
    });

    const messageId = await postProductToChannel(product);

    console.log('[post-product] Successfully posted, messageId:', messageId);

    // Save the Telegram message ID so we can edit/delete later
    await prisma.product.update({
      where: { id: productId },
      data: { telegramMessageId: String(messageId) },
    });

    return NextResponse.json({ success: true, messageId });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[post-product] Error posting to Telegram:', message);
    return NextResponse.json(
      { error: 'Failed to post to Telegram', details: message },
      { status: 500 }
    );
  }
}
