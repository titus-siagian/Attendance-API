import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMasterLocationDto } from './dto/create-master-location.dto';
import { UpdateMasterLocationDto } from './dto/update-master-location.dto';

@Injectable()
export class MasterLocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMasterLocationDto: CreateMasterLocationDto) {
    const data = await this.prisma.masterLocation.create({
      data: createMasterLocationDto,
    });
    return { data };
  }

  async findAll() {
    const data = await this.prisma.masterLocation.findMany();
    return { data };
  }

  async findOne(id: string) {
    const data = await this.prisma.masterLocation.findUnique({ where: { id } });
    return { data };
  }

  async update(id: string, updateMasterLocationDto: UpdateMasterLocationDto) {
    const data = await this.prisma.masterLocation.update({
      data: updateMasterLocationDto,
      where: { id },
    });
    return { data };
  }

  async remove(id: string) {
    const data = await this.prisma.masterLocation.delete({ where: { id } });
    return { data };
  }

  async findNearest(latitude: number, longitude: number) {
    const data = await this.prisma.$queryRaw`SELECT 
    id, 
    latitude,
    longitude,
    radius,
    (
       6371 *
       acos(cos(radians(${latitude})) * 
       cos(radians(latitude)) * 
       cos(radians(longitude) - 
       radians(${longitude})) + 
       sin(radians(${latitude})) * 
       sin(radians(latitude)))
    ) AS distance 
    FROM MasterLocation
    HAVING distance < 10
    ORDER BY distance LIMIT 0, 20`;
    return { data };
  }
}
