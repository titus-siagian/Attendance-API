import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { fromPairs, isEmpty } from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';
import AuditQuery from './filters/audit.filters';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(query: AuditQuery) {
    const whereClause: Prisma.HistoryWhereInput = {};

    let sorting: any;
    if (!isEmpty(query.sortBy)) {
      sorting = query.sortBy.map((x) => fromPairs([x.split(' ')]));
    }

    if (!isEmpty(query.userId)) {
      whereClause.userId = {
        contains: query.userId,
      };
    }

    const data = await this.prisma.history.findMany({
      orderBy: !isEmpty(sorting) ? sorting : [{ createdAt: 'asc' }],
      where: whereClause,
      cursor: !isEmpty(query.cursor)
        ? {
            id: query.cursor,
          }
        : undefined,
      take: query.take,
      skip: query.skip,
    });

    const total = await this.prisma.history.count({ where: whereClause });

    return {
      data,
      total,
    };
  }
}
