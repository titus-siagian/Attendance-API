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
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiCustomResponse,
  ApiCustomResponseArray,
} from 'src/prisma/response/default.response';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { FamilyEntity } from './entities/family.entity';
import { FamilyService } from './family.service';
import { FamilyQuery } from './filters/family.filter';

@ApiTags('Family')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('family')
@ApiExtraModels(FamilyEntity)
export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}

  @ApiCustomResponse(FamilyEntity)
  @Post()
  create(@Body() createFamilyDto: CreateFamilyDto) {
    return this.familyService.create(createFamilyDto);
  }

  @ApiCustomResponseArray(FamilyEntity)
  @Get()
  findAll(@Query() query: FamilyQuery) {
    return this.familyService.findAll(query);
  }

  @ApiCustomResponse(FamilyEntity)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.familyService.findOne(id);
  }

  @ApiCustomResponse(FamilyEntity)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFamilyDto: UpdateFamilyDto) {
    return this.familyService.update(id, updateFamilyDto);
  }

  @ApiCustomResponse(FamilyEntity)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.familyService.remove(id);
  }
}
