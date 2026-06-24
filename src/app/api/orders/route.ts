import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { notifyAdminNewOrder } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    productId,
    customerName,
    customerPhone,
    customerAddress,
    quantity,
    totalPrice,
    note,
    telegramUserId,
  } = body;

  // Validate
  if (!productId || !customerName || !customerPhone || !customerAddress) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Verify product exists
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  // Create order
  const order = await prisma.order.create({
    data: {
      productId,
      customerName,
      customerPhone,
      customerAddress,
      quantity: quantity ?? 1,
      totalPrice: totalPrice ?? product.price * (quantity ?? 1),
      note,
      telegramUserId,
    },
  });

  // Notify admin via Telegram (fire and forget — don't block response)
  notifyAdminNewOrder({
    id: order.id,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    customerAddress: order.customerAddress,
    quantity: order.quantity,
    totalPrice: order.totalPrice,
    productName: product.name,
    note: order.note,
  }).catch(console.error);

  return NextResponse.json({ success: true, orderId: order.id }, { status: 201 });
}

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { product: { select: { name: true, imageUrl: true } } },
  });
  return NextResponse.json(orders);
}
