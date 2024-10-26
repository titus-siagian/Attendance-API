import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { fromPairs, isEmpty } from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { FamilyQuery } from './filters/family.filter';

@Injectable()
export class FamilyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFamilyDto: CreateFamilyDto) {
    const data = await this.prisma.family.upsert({
      where: {
        identityNumber: createFamilyDto.identityNumber,
      },
      update: createFamilyDto,
      create: createFamilyDto,
    });

    return {
      data,
    };
  }

  async findAll(query?: FamilyQuery) {
    const whereClause: Prisma.FamilyWhereInput = {};

    let sorting: any;
    if (!isEmpty(query.sortBy)) {
      sorting = query.sortBy.map((x) => fromPairs([x.split(' ')]));
    }

    if (query.username) {
      whereClause.user = {
        name: {
          contains: query.username,
        },
      };
    }

    if (query.name) {
      whereClause.name = {
        contains: query.name,
      };
    }

    const data = await this.prisma.family.findMany({
      where: whereClause,
      skip: query.skip,
      take: query.take,
      orderBy: !isEmpty(sorting) ? sorting : [],
      cursor: !isEmpty(query.cursor)
        ? {
            id: query.cursor,
          }
        : undefined,
    });
    const total = await this.prisma.family.count({ where: whereClause });
    return {
      data,
      total,
    };
  }

  async findOne(id: string) {
    const data = await this.prisma.family.findUnique({
      where: {
        id,
      },
    });
    return {
      data,
    };
  }

  async update(id: string, updateFamilyDto: UpdateFamilyDto) {
    const data = await this.prisma.family.update({
      where: {
        id,
      },
      data: updateFamilyDto,
    });
    return {
      data,
    };
  }

  async remove(id: string) {
    const data = await this.prisma.family.delete({
      where: {
        id,
      },
    });
    return {
      data,
    };
  }
}
