import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FcmService {
  constructor(private readonly prisma: PrismaService) {}

  async sync(userId: string, token: string) {
    await this.prisma.fCM.upsert({
      where: {
        userId,
      },
      update: {
        token,
      },
      create: {
        token,
        userId,
      },
    });
    return {};
  }

  async unsync(userId: string) {
    await this.prisma.fCM.delete({
      where: {
        userId,
      },
    });
  }
}
