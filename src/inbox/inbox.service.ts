import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import CreateInboxDto from './dto/create-inbox.dto';
import InboxQuery from './filters/inbox.filter';

@Injectable()
export class InboxService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createInboxDto: CreateInboxDto) {
    const { userIds, ...data } = createInboxDto;

    let dataUserIds: Prisma.JsonArray;

    if (userIds) {
      dataUserIds = userIds.map((x: string) => {
        return {
          id: x,
        };
      });
    }

    const response = await this.prisma.inbox.create({
      data: {
        ...data,
        userIds: dataUserIds,
      },
    });

    return {
      data: response,
    };
  }

  async getAll(query?: InboxQuery) {
    const whereClause: Prisma.InboxWhereInput = {};

    if (query.userId) {
      whereClause.userIds = {
        path: '$',
        array_contains: {
          id: query.userId,
        },
      };
    }

    const data = await this.prisma.inbox.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await this.prisma.inbox.count({
      where: whereClause,
    });

    return {
      data,
      total,
    };
  }
}
