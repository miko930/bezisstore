const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const products = await prisma.product.findMany({});
  console.log("PRODUCTS IN DATABASE:");
  products.forEach(p => {
    console.log(`ID: ${p.id} | Name: ${p.name} | ImageUrl: ${p.imageUrl}`);
  });
}

run().catch(console.error).finally(() => prisma.$disconnect());
