import { PrismaClient } from '.prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const company = await prisma.company.upsert({
    where: {
      id: 'C1',
    },
    update: {},
    create: {
      id: 'C1',
      name: 'Company Demo',
    },
  });

  const division = await prisma.division.upsert({
    where: {
      id: 'D1',
    },
    update: {},
    create: {
      companyId: company.id,
      id: 'D1',
      name: 'Division Demo',
    },
  });

  const subDivision = await prisma.subdivision.upsert({
    where: {
      id: 'SD1',
    },
    update: {},
    create: {
      id: 'SD1',
      divisionId: division.id,
      name: 'Sub Division DEMO',
    },
  });

  const department = await prisma.department.upsert({
    where: {
      id: 'DP1',
    },
    update: {},
    create: {
      id: 'DP1',
      subdivisionId: subDivision.id,
      name: 'Department Demo',
    },
  });

  const passwordUser = await hash('12345678', 9);
  const user = await prisma.user.upsert({
    where: {
      email: 'demo@example.com',
    },
    create: {
      identityNumber: '123456789',
      phone: '083242452',
      blood: 'A',
      placeOfBirth: 'Jakarta',
      sex: 1,
      name: 'Demo Account',
      dateOfBirth: new Date(new Date('1998-03-01').setHours(7)),
      email: 'demo@example.com',
      password: passwordUser,
      role: 'USER',
      companyId: company.id,
      divisionId: division.id,
      subdivisionId: subDivision.id,
      departmentId: department.id,
    },
    update: {},
  });
  console.log('========= CREATE USER DEMO =======');
  console.log('User', user);

  const family = await prisma.family.upsert({
    where: {
      identityNumber: '1',
    },
    update: {},
    create: {
      identityNumber: '1',
      sex: 0,
      relationship: 2,
      name: 'Demo',
      dateOfBirth: new Date(new Date('1998-03-01').setHours(7)),
      userId: user.id,
    },
  });

  console.log('========= CREATE FAMILY DEMO =======');
  console.log('family', family);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
