import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiCustomResponse,
  ApiCustomResponseArray,
} from 'src/prisma/response/default.response';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import RequestAttendanceDto from './dto/request-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AttendanceEntity } from './entities/attendance.entity';
import AttendanceQuery from './filters/attendance.filter';

@ApiTags('Attendance')
@UseGuards(JwtAuthGuard)
@ApiExtraModels(AttendanceEntity)
@Controller('attendance')
export class AttendanceController {
  constructor(
    private readonly attendanceService: AttendanceService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiCustomResponse(AttendanceEntity)
  @Post()
  create(
    @Body() createAttendanceDto: CreateAttendanceDto,
    @Req() request: Request,
  ) {
    const token = request.headers.authorization.split(' ')[1];
    const user = this.jwtService.verify(token);
    createAttendanceDto.userId = user.id;
    return this.attendanceService.create(createAttendanceDto);
  }

  @ApiBearerAuth()
  @ApiCustomResponse(AttendanceEntity)
  @Post('/request')
  request(
    @Body() requestAttendanceDto: RequestAttendanceDto,
    @Req() request: Request,
  ) {
    const token = request.headers.authorization.split(' ')[1];
    const user = this.jwtService.verify(token);
    requestAttendanceDto.userId = user.id;
    return this.attendanceService.request(requestAttendanceDto);
  }

  @ApiCustomResponseArray(AttendanceEntity)
  @Get('/report')
  report(@Query() query: AttendanceQuery) {
    return this.attendanceService.report(query);
  }

  @ApiCustomResponseArray(AttendanceEntity)
  @Get()
  findAll(@Query() query: AttendanceQuery) {
    return this.attendanceService.findAll(query);
  }

  @ApiCustomResponse(AttendanceEntity)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(id);
  }

  @ApiCustomResponse(AttendanceEntity)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.update(id, updateAttendanceDto);
  }
}
