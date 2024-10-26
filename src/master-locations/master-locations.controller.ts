import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiCustomResponseArray,
  ApiCustomResponse,
} from 'src/prisma/response/default.response';
import { CreateMasterLocationDto } from './dto/create-master-location.dto';
import { UpdateMasterLocationDto } from './dto/update-master-location.dto';
import { MasterLocationEntity } from './entities/master-location.entity';
import { MasterLocationsService } from './master-locations.service';

@ApiTags('Master Locations')
@UseGuards(JwtAuthGuard)
@Controller('master-locations')
@ApiExtraModels(MasterLocationEntity)
export class MasterLocationsController {
  constructor(
    private readonly masterLocationsService: MasterLocationsService,
  ) {}

  @ApiCustomResponse(MasterLocationEntity)
  @Post()
  create(@Body() createMasterLocationDto: CreateMasterLocationDto) {
    return this.masterLocationsService.create(createMasterLocationDto);
  }

  @ApiCustomResponseArray(MasterLocationEntity)
  @Get()
  findAll() {
    return this.masterLocationsService.findAll();
  }

  @ApiCustomResponse(MasterLocationEntity)
  @Get('/nearest')
  findNearest(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
  ) {
    return this.masterLocationsService.findNearest(+latitude, +longitude);
  }

  @ApiCustomResponse(MasterLocationEntity)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.masterLocationsService.findOne(id);
  }

  @ApiCustomResponse(MasterLocationEntity)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMasterLocationDto: UpdateMasterLocationDto,
  ) {
    return this.masterLocationsService.update(id, updateMasterLocationDto);
  }

  @ApiCustomResponse(MasterLocationEntity)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.masterLocationsService.remove(id);
  }
}
