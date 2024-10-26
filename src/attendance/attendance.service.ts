import { Attendance, Prisma, User } from '.prisma/client';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as ExcelJS from 'exceljs';
import { fromPairs, get, isEmpty } from 'lodash';
import { join } from 'path';
import { env } from 'process';
import { PrismaService } from 'src/prisma/prisma.service';
import { convertDateToUTC } from 'src/utils/helper';
import AttendanceHelper from './attendance.helper';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import RequestAttendanceDto from './dto/request-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import AttendanceQuery from './filters/attendance.filter';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto) {
    const data = await this.prisma.attendance.create({
      data: createAttendanceDto,
    });

    return {
      data,
    };
  }

  async findAll(query?: AttendanceQuery) {
    const whereClause: Prisma.AttendanceWhereInput = {};

    let sorting: any;
    if (!isEmpty(query.sortBy)) {
      sorting = query.sortBy.map((x) => fromPairs([x.split(' ')]));
    }

    if (query.identityNumber) {
      whereClause.user = {
        identityNumber: {
          contains: query.identityNumber,
        },
      };
    }

    if (query.username) {
      whereClause.user = {
        name: {
          contains: query.username,
        },
      };
    }

    if (query.userId) {
      whereClause.user = {
        id: {
          contains: query.userId,
        },
      };
    }

    if (!isEmpty(query.type)) {
      whereClause.type = {
        equals: query.type,
      };
    }

    if (!isEmpty(query.value)) {
      whereClause.value = {
        equals: query.value,
      };
    }

    if (!isEmpty(query.userId)) {
      whereClause.userId = {
        equals: query.userId,
      };
    }

    if (!isEmpty(query.startDate) || !isEmpty(query.endDate)) {
      whereClause.createdAt = {
        gte: query.startDate
          ? convertDateToUTC(
              new Date(new Date(query.startDate).setHours(0, 0, 0, 0)),
            )
          : undefined,
        lte: query.endDate
          ? convertDateToUTC(
              new Date(new Date(query.endDate).setHours(24, 0, 0, 0)),
            )
          : undefined,
      };
    }

    const data = await this.prisma.attendance.findMany({
      orderBy: !isEmpty(sorting)
        ? sorting
        : {
            createdAt: 'desc',
          },
      where: whereClause,
      cursor: !isEmpty(query.cursor)
        ? {
            id: query.cursor,
          }
        : undefined,
      skip: query.skip,
      take: query.take,
    });

    const total = await this.prisma.attendance.count({
      where: whereClause,
    });

    return {
      data,
      total,
    };
  }

  async findOne(id: string) {
    const data = await this.prisma.attendance.findUnique({ where: { id } });
    return {
      data,
    };
  }

  async update(id: string, updateAttendanceDto: UpdateAttendanceDto) {
    const data = await this.prisma.attendance.update({
      data: updateAttendanceDto,
      where: { id },
    });
    return {
      data,
    };
  }

  async remove(id: string) {
    const data = await this.prisma.attendance.delete({ where: { id } });
    return {
      data,
    };
  }

  async request(requestAttendanceDto: RequestAttendanceDto) {
    const { time, ...data } = requestAttendanceDto;

    if (!time) {
      throw new BadRequestException('Field time harus di isi');
    }

    const response = await this.prisma.attendance.create({
      data: {
        ...data,
        createdAt: time,
        photoUrl: '',
      },
    });

    return {
      data: response,
    };
  }

  async report(query?: AttendanceQuery) {
    const whereClause: Prisma.AttendanceWhereInput = {};

    if (query.identityNumber) {
      whereClause.user = {
        identityNumber: {
          contains: query.identityNumber,
        },
      };
    }

    if (query.username) {
      whereClause.user = {
        name: {
          contains: query.username,
        },
      };
    }

    if (query.type) {
      whereClause.type = {
        equals: query.type,
      };
    }

    if (query.value) {
      whereClause.value = {
        equals: query.value,
      };
    }

    if (query.userId) {
      whereClause.userId = {
        equals: query.userId,
      };
    }

    if (!isEmpty(query.startDate) || !isEmpty(query.endDate)) {
      whereClause.createdAt = {
        gte: !isEmpty(query.startDate)
          ? convertDateToUTC(
              new Date(new Date(query.startDate).setHours(0, 0, 0, 0)),
            )
          : undefined,
        lte: !isEmpty(query.endDate)
          ? convertDateToUTC(
              new Date(new Date(query.endDate).setHours(24, 0, 0, 0)),
            )
          : undefined,
      };
    }

    const report = await this.prisma.attendance.findMany({
      orderBy: {
        createdAt: 'asc',
      },
      where: whereClause,
      include: {
        user: true,
      },
    });

    const findLocation = await Promise.all(
      report.map((x) =>
        this.prisma.masterLocation.findUnique({
          where: {
            id: x.masterLocationId || 'undefined',
          },
        }),
      ),
    );

    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(join(__dirname, 'template/report.xlsx'));
    const ws = wb.worksheets[0];
    const data = [];

    for (let i = 0; i < report.length; i++) {
      const cell = [];
      const element = report[i];
      // Photo
      if (query.image) {
        const { data: getAvatar } = await this.httpService
          .get<Buffer>(
            `http://localhost:${env.SERVER_PORT}/api/${element.user.avatarUrl}`,
            {
              responseType: 'arraybuffer',
            },
          )
          .toPromise();
        const avatar = wb.addImage({
          buffer: getAvatar,
          extension: 'jpeg',
        });
        ws.addImage(avatar, {
          tl: { col: 0, row: 4 + i },
          ext: { width: 200, height: 200 },
        });
      } else {
        cell[1] = '-';
      }
      // NIK
      cell[2] = element.user.id;
      // Nama
      cell[3] = element.user.name;
      // Kode Jadwal
      cell[4] = '-';
      // Duty On
      cell[5] = '-';
      // Duty Off
      cell[6] = '-';
      // Datetime
      cell[7] = dayjs(element.createdAt).format('DD/MM/YYYY HH:mm');
      // Tipe Clock
      cell[8] = element.value === 'ClockIn' ? 'In' : 'Out';
      // Tipe Attendance
      cell[9] = isEmpty(element.problem) ? element.type : 'Request';
      // Masalah
      cell[10] = isEmpty(element.problem)
        ? '-'
        : AttendanceHelper.convertProblem(element.problem);
      // keterangan
      cell[11] = element.description;
      // photo capture
      if (!isEmpty(element.photoUrl) && query.image) {
        const { data: getPhotoLocation } = await this.httpService
          .get<Buffer>(
            `http://localhost:${env.SERVER_PORT}/api/${element.photoUrl}`,
            {
              responseType: 'arraybuffer',
            },
          )
          .toPromise();
        const avatar = wb.addImage({
          buffer: getPhotoLocation,
          extension: 'jpeg',
        });
        ws.addImage(avatar, {
          tl: { col: 11, row: 4 + i },
          ext: { width: 200, height: 200 },
        });
      } else {
        cell[12] = '-';
      }
      // lokasi
      const location = findLocation[i];
      cell[13] = get(location, 'name', '');
      // koordinat
      cell[14] = `${element.latitude}, ${element.longitude}`;

      data.push(cell);
    }

    ws.insertRows(5, data);

    ws.columns.forEach((column) => {
      let maxColumnLength = 0;
      column.eachCell({ includeEmpty: true }, (cell, row) => {
        maxColumnLength = Math.max(
          maxColumnLength,
          10,
          cell.value ? cell.value.toString().length : 0,
        );

        if (row > 4) {
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center',
          };
        }
      });
      column.width = maxColumnLength + 2;
    });

    if (query.image) {
      for (let j = 0; j < report.length; j++) {
        const row = ws.getRow(5 + j);
        row.height = 160;
        const col = ws.getColumn(1);
        col.width = 26;
        const photoLocationCol = ws.getColumn(12);
        photoLocationCol.width = 26;
      }
    }

    const ws2 = wb.worksheets[1];
    const data2 = [];
    if (!isEmpty(query.startDate) && !isEmpty(query.endDate)) {
      const getDateRange = this.dateRange(query.startDate, query.endDate, 1);
      let index = 0;
      console.log('Date reange', getDateRange);
      for (const date of getDateRange) {
        console.log(
          index != getDateRange.length - 1 ? getDateRange[index + 1] : date,
        );
        const getClockIn = await this.prisma.attendance.findMany({
          orderBy: {
            createdAt: 'asc',
          },
          where: {
            createdAt: {
              gte: date,
              lte:
                index != getDateRange.length - 1
                  ? getDateRange[index + 1]
                  : date,
            },
            value: 'ClockIn',
          },
          include: {
            user: true,
          },
        });

        let clockIn:
          | (Attendance & {
              user: User;
            })
          | null = null;
        if (!isEmpty(getClockIn)) {
          clockIn = getClockIn[0];
        }

        const getClockOut = await this.prisma.attendance.findMany({
          orderBy: {
            createdAt: 'desc',
          },
          where: {
            createdAt: {
              gte: date,
              lte:
                index != getDateRange.length - 1
                  ? getDateRange[index + 1]
                  : date,
            },
            value: 'ClockOut',
          },
          include: {
            user: true,
          },
        });

        let clockOut:
          | (Attendance & {
              user: User;
            })
          | null = null;
        if (!isEmpty(getClockOut)) {
          clockOut = getClockOut[0];
        }

        if (isEmpty(clockIn) && isEmpty(clockOut)) {
          index += 1;
          continue;
        }

        const cell = [];
        const element: Attendance & {
          user: User;
        } = !isEmpty(clockIn) ? clockIn : clockOut;

        // photo
        if (query.image) {
          const { data: getAvatar } = await this.httpService
            .get<Buffer>(
              `http://localhost:${env.SERVER_PORT}/api/${element.user.avatarUrl}`,
              {
                responseType: 'arraybuffer',
              },
            )
            .toPromise();
          const avatar = wb.addImage({
            buffer: getAvatar,
            extension: 'jpeg',
          });
          ws2.addImage(avatar, {
            tl: { col: 0, row: 4 + index },
            ext: { width: 200, height: 200 },
          });
        } else {
          cell[1] = '-';
        }

        // NIK
        cell[2] = element?.user?.id ?? '-';
        // Nama
        cell[3] = element?.user?.name;
        // Kode Jadwal
        cell[4] = '-';
        // Duty On
        cell[5] = '-';
        // Duty Off
        cell[6] = '-';
        // Akutal Detail in
        cell[7] = !isEmpty(clockIn)
          ? dayjs(clockIn.createdAt).format('DD/MM/YYYY HH:mm')
          : '-';
        // Akutal Detail out
        cell[8] = !isEmpty(clockOut)
          ? dayjs(clockOut.createdAt).format('DD/MM/YYYY HH:mm')
          : '-';
        // Tipe Attendance
        cell[9] = element.type;
        // keterangan in
        cell[10] = !isEmpty(clockIn) ? clockIn.description : '-';
        // keterangan out
        cell[11] = !isEmpty(clockOut) ? clockOut.description : '-';
        // photo in
        if (get(clockIn, 'photoUrl', false) && query.image) {
          const { data: getClockInPhoto } = await this.httpService
            .get<Buffer>(
              `http://localhost:${env.SERVER_PORT}/api/${clockIn.photoUrl}`,
              {
                responseType: 'arraybuffer',
              },
            )
            .toPromise();
          const avatar = wb.addImage({
            buffer: getClockInPhoto,
            extension: 'jpeg',
          });
          ws2.addImage(avatar, {
            tl: { col: 12, row: 4 + index },
            ext: { width: 200, height: 200 },
          });
        } else {
          cell[12] = '-';
        }
        // photo out
        if (get(clockOut, 'photoUrl', false) && query.image) {
          const { data: getClockOutPhoto } = await this.httpService
            .get<Buffer>(
              `http://localhost:${env.SERVER_PORT}/api/${clockOut.photoUrl}`,
              {
                responseType: 'arraybuffer',
              },
            )
            .toPromise();
          const avatar = wb.addImage({
            buffer: getClockOutPhoto,
            extension: 'jpeg',
          });
          ws2.addImage(avatar, {
            tl: { col: 13, row: 4 + index },
            ext: { width: 200, height: 200 },
          });
        } else {
          cell[13] = '-';
        }
        // lokasi in
        if (get(clockIn, 'masterLocationId', false)) {
          const getClockInLocation = await this.prisma.masterLocation.findFirst(
            {
              where: {
                id: clockIn.masterLocationId,
              },
            },
          );
          cell[14] = getClockInLocation.name;
        } else {
          cell[14] = '-';
        }
        // lokasi out
        if (get(clockOut, 'masterLocationId', false)) {
          const getClockInLocation = await this.prisma.masterLocation.findFirst(
            {
              where: {
                id: clockOut.masterLocationId,
              },
            },
          );
          cell[15] = getClockInLocation.name;
        } else {
          cell[15] = '-';
        }

        // koordinat
        cell[16] = `${element.latitude}, ${element.longitude}`;

        index += 1;
        data2.push(cell);
      }
    }
    ws2.insertRows(5, data2);

    ws2.columns.forEach((column) => {
      let maxColumnLength = 0;
      column.eachCell({ includeEmpty: true }, (cell, row) => {
        maxColumnLength = Math.max(
          maxColumnLength,
          10,
          cell.value ? cell.value.toString().length : 0,
        );

        if (row > 4) {
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center',
          };
        }
      });
      column.width = maxColumnLength + 2;
    });

    console.log('query', query);
    if (query.image) {
      console.log('test');
      for (let j = 0; j < data2.length; j++) {
        const row = ws2.getRow(5 + j);
        row.height = 160;
        const col = ws2.getColumn(1);
        col.width = 26;
        const photoLocationCol = ws2.getColumn(12);
        photoLocationCol.width = 26;
      }
    }

    const buff = await wb.xlsx.writeBuffer();
    return {
      data: buff,
    };
  }

  dateRange(startDate: string, endDate: string, steps = 1): Date[] {
    const dateArray = [];
    const currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      dateArray.push(
        convertDateToUTC(new Date(currentDate.toLocaleDateString())),
      );
      currentDate.setUTCDate(currentDate.getUTCDate() + steps);
    }

    return dateArray;
  }
}
