import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Announcement, Prisma } from '@prisma/client';
import { fromPairs, isEmpty, map } from 'lodash';
import CreateInboxDto from 'src/inbox/dto/create-inbox.dto';
import { InboxService } from 'src/inbox/inbox.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import AnnouncementQuery from './filters/announcement.filter';

@Injectable()
export class AnnouncementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly inboxService: InboxService,
  ) {}

  async create(createAnnouncementDto: CreateAnnouncementDto) {
    const { companyIds, divisionIds, subdivisionIds, ...data } =
      createAnnouncementDto;

    let dataCompanyIds: Prisma.JsonArray;
    let dataDivisionIds: Prisma.JsonArray;
    let dataSubdivisionIds: Prisma.JsonArray;

    if (!isEmpty(companyIds)) {
      dataCompanyIds = companyIds.map((e) => {
        return {
          id: e,
        };
      });
    }

    if (!isEmpty(divisionIds)) {
      dataDivisionIds = divisionIds.map((e) => {
        return {
          id: e,
        };
      });
    }

    if (!isEmpty(subdivisionIds)) {
      dataSubdivisionIds = subdivisionIds.map((e) => {
        return {
          id: e,
        };
      });
    }

    const publishNow = Date.now() > data.createdAt.getMilliseconds();

    const announcement = await this.prisma.announcement.create({
      data: {
        ...data,
        companyIds: dataCompanyIds,
        divisionIds: dataDivisionIds,
        subdivisionIds: dataSubdivisionIds,
        published: publishNow,
      },
    });

    if (publishNow) {
      this.sendNotification(
        announcement,
        companyIds,
        divisionIds,
        subdivisionIds,
      );
    }

    return {
      data: announcement,
    };
  }

  async findAll(query?: AnnouncementQuery) {
    const whereClause: Prisma.AnnouncementWhereInput = {};

    let sorting: any;
    if (!isEmpty(query.sortBy)) {
      sorting = query.sortBy.map((x) => fromPairs([x.split(' ')]));
    }

    if (query.title) {
      whereClause.title = {
        contains: query.title,
      };
    }

    if (query.company) {
      whereClause.companyIds = {
        path: '$',
        array_contains: {
          id: query.company,
        },
      };
    }

    if (query.division) {
      whereClause.divisionIds = {
        path: '$',
        array_contains: {
          id: query.division,
        },
      };
    }

    if (query.createdAt) {
      whereClause.createdAt = {
        gte: query.createdAt,
      };
    }

    if (query.expiredAt) {
      whereClause.OR = [
        {
          expiredAt: {
            equals: null,
          },
        },
        {
          expiredAt: {
            gte: query.expiredAt,
          },
        },
      ];
    }

    const response = await this.prisma.announcement.findMany({
      where: whereClause,
      orderBy: !isEmpty(sorting)
        ? sorting
        : {
            createdAt: 'desc',
          },
      take: query.take,
      skip: query.skip,
      cursor: !isEmpty(query.cursor)
        ? {
            id: parseInt(query.cursor),
          }
        : undefined,
    });

    const total = await this.prisma.announcement.count({
      where: whereClause,
    });

    return {
      data: response,
      total,
    };
  }

  async findOne(id: number) {
    const data = await this.prisma.announcement.findUnique({
      where: { id },
    });
    return {
      data,
    };
  }

  async update(id: number, updateAnnouncementDto: UpdateAnnouncementDto) {
    const { companyIds, divisionIds, subdivisionIds, ...data } =
      updateAnnouncementDto;

    let dataCompanyIds: Prisma.JsonArray;
    let dataDivisionIds: Prisma.JsonArray;
    let dataSubdivisionIds: Prisma.JsonArray;

    if (!isEmpty(companyIds)) {
      dataCompanyIds = companyIds.map((e) => {
        return {
          id: e,
        };
      });
    }

    if (!isEmpty(divisionIds)) {
      dataDivisionIds = divisionIds.map((e) => {
        return {
          id: e,
        };
      });
    }

    if (!isEmpty(subdivisionIds)) {
      dataSubdivisionIds = subdivisionIds.map((e) => {
        return {
          id: e,
        };
      });
    }

    const announcement = await this.prisma.announcement.update({
      where: { id },
      data: {
        ...data,
        companyIds: dataCompanyIds,
        divisionIds: dataDivisionIds,
        subdivisionIds: dataSubdivisionIds,
      },
    });

    return {
      data: announcement,
    };
  }

  async remove(id: number) {
    const data = await this.prisma.announcement.delete({ where: { id } });
    return {
      data,
    };
  }

  async addAttachment(createAttachmentDto: CreateAttachmentDto) {
    const data = await this.prisma.attachment.create({
      data: createAttachmentDto,
    });
    return {
      data,
    };
  }

  async removeAttachment(id: string) {
    const data = await this.prisma.attachment.delete({
      where: {
        id,
      },
    });
    return {
      data,
    };
  }

  async getAllAttachment(id: number) {
    const data = await this.prisma.attachment.findMany({
      where: {
        announcementId: id,
      },
    });

    const total = await this.prisma.attachment.count({
      where: {
        announcementId: id,
      },
    });

    return {
      data,
      total,
    };
  }

  async sendNotification(
    announcement: Announcement,
    companyIds: string[],
    divisionIds: string[],
    subdivisionIds: string[],
  ) {
    const findUser = await this.prisma.user.findMany({
      where: {
        companyId: {
          in: companyIds,
        },
        divisionId: {
          in: divisionIds,
        },
        subdivisionId: {
          in: subdivisionIds,
        },
      },
    });

    const getUserIds = map(findUser, 'id');

    const createInboxDto = new CreateInboxDto();
    createInboxDto.title = 'Pengumuman';
    createInboxDto.body = announcement.title;
    createInboxDto.data = `announcement ${announcement.id}`;
    createInboxDto.userIds = getUserIds;

    await this.inboxService.create(createInboxDto);

    const findFCM = await this.prisma.fCM.findMany({
      where: {
        userId: {
          in: getUserIds,
        },
      },
    });

    if (!isEmpty(findFCM)) {
      const getToken = map(findFCM, 'token');
      const requestNotification = {
        registration_ids: getToken,
        notification: {
          title: announcement.title,
          body: announcement.description,
        },
        data: {
          click_action: 'FLUTTER_NOTIFICATION_CLICK',
          value: `announcement ${announcement.id}`,
        },
      };

      this.httpService
        .post('https://fcm.googleapis.com/fcm/send', requestNotification, {
          headers: {
            Authorization:
              'key=AAAAz_B7KMM:APA91bEqxPnVMZg5YBKNWc8oeDgCQ-frlxU3-9BmBKAbiUOnAa5mXYqxciyhZwMRSoluQH0_n4xV4oYfSl__PaOmDPledeqg_hx7FhUC2FgvD4gC2nP8TdfnOiHXHWUeiAzW9H7HJBWi',
            'Content-Type': 'application/json',
          },
        })
        .toPromise();
    }
  }
}
