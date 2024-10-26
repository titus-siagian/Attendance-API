import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { isEmpty } from 'lodash';
import { AnnouncementService } from 'src/announcement/announcement.service';
import CompanyInterface from 'src/announcement/interface/company.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { convertDateToUTC } from 'src/utils/helper';

@Injectable()
export class TasksService {
  constructor(
    private readonly announcementService: AnnouncementService,
    private readonly prisma: PrismaService,
  ) {}
  private readonly logger = new Logger(TasksService.name);

  @Cron('0 0 7 * * 1-7')
  async handleCron() {
    this.logger.debug('Called everyday at 7am');
    const currentDate = Date.now();
    const getAnnouncement = await this.prisma.announcement.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    const findAnnouncement = getAnnouncement.filter(
      (x) =>
        convertDateToUTC(x.createdAt).getMilliseconds() < currentDate &&
        !x.published,
    );

    if (!isEmpty(findAnnouncement)) {
      await Promise.all(
        findAnnouncement.map((x) =>
          this.prisma.announcement.update({
            where: {
              id: x.id,
            },
            data: {
              published: true,
            },
          }),
        ),
      );

      await Promise.all(
        findAnnouncement.map((x) => {
          const company = x.companyIds as unknown as CompanyInterface[];
          const division = x.divisionIds as unknown as CompanyInterface[];
          const subdivison = x.subdivisionIds as unknown as CompanyInterface[];
          return this.announcementService.sendNotification(
            x,
            !isEmpty(company) ? company.map((x) => x.id) : [],
            !isEmpty(division) ? division.map((x) => x.id) : [],
            !isEmpty(subdivison) ? subdivison.map((x) => x.id) : [],
          );
        }),
      );
    }
  }
}
