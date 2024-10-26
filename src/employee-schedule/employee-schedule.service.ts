import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmployeeScheduleDto } from './dto/create-employee-schedule.dto';
import { UpdateEmployeeScheduleDto } from './dto/update-employee-schedule.dto';

@Injectable()
export class EmployeeScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  create(createEmployeeScheduleDto: CreateEmployeeScheduleDto) {
    return this.prisma.employeeSchedule.create({
      data: createEmployeeScheduleDto,
    });
  }

  findAll() {
    return this.prisma.employeeSchedule.findMany();
  }

  async findSchedule(day: number, identityNumber: string) {
    const schedule = await this.prisma.employeeSchedule.findFirst({
      where: {
        day,
        userId: identityNumber,
      },
    });

    if (!schedule) {
      throw new NotFoundException();
    }

    return schedule;
  }

  findOne(id: number) {
    return this.prisma.employeeSchedule.findFirst({ where: { id } });
  }

  update(id: number, updateEmployeeScheduleDto: UpdateEmployeeScheduleDto) {
    return this.prisma.employeeSchedule.update({
      where: { id },
      data: updateEmployeeScheduleDto,
    });
  }

  remove(id: number) {
    return this.prisma.employeeSchedule.delete({
      where: { id },
    });
  }
}
