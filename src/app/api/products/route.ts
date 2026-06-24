import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resolveImageUrl } from '@/lib/telegram';

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, description, price, imageUrl } = body;

  if (!name || !price || !imageUrl) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const resolvedImageUrl = await resolveImageUrl(imageUrl);

  const product = await prisma.product.create({
    data: { 
      name, 
      description, 
      price: parseFloat(price), 
      imageUrl: resolvedImageUrl 
    },
  });

  return NextResponse.json(product, { status: 201 });
}
