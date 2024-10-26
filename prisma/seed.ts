import { PrismaClient } from '.prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordAdmin = await hash('12345678', 9);
  const admin = await prisma.user.upsert({
    where: {
      email: 'admin@admin.com',
    },
    create: {
      identityNumber: '1',
      email: 'admin@admin.com',
      password: passwordAdmin,
      role: 'ADMIN',
    },
    update: {},
  });
  console.log('========= CREATE USER ADMIN =======');
  console.log('User', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
