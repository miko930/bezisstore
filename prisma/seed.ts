import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

// Setup database connection with adapter for Prisma 7 + Supabase
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash('admin123', 10);

  const admin = await prisma.admin.upsert({
    where: { email: 'admin@shop.com' },
    update: {},
    create: {
      email: 'admin@shop.com',
      password,
      name: 'Admin',
    },
  });

  console.log('✅ Admin created:', admin.email);
  console.log('🔑 Password: admin123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
