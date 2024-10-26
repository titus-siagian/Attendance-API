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
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateEmployeeScheduleDto } from './dto/create-employee-schedule.dto';
import { UpdateEmployeeScheduleDto } from './dto/update-employee-schedule.dto';
import { EmployeeScheduleService } from './employee-schedule.service';
import { EmployeeScheduleEntity } from './entities/employee-schedule.entity';

@ApiTags('Employee Schedule')
@UseGuards(JwtAuthGuard)
@Controller('employee-schedule')
export class EmployeeScheduleController {
  constructor(
    private readonly employeeScheduleService: EmployeeScheduleService,
  ) {}

  @ApiCreatedResponse({ type: EmployeeScheduleEntity })
  @Post()
  create(@Body() createEmployeeScheduleDto: CreateEmployeeScheduleDto) {
    return this.employeeScheduleService.create(createEmployeeScheduleDto);
  }

  @ApiOkResponse({ type: EmployeeScheduleEntity, isArray: true })
  @Get()
  findAll() {
    return this.employeeScheduleService.findAll();
  }

  @ApiOkResponse({ type: EmployeeScheduleEntity })
  @Get('/day/:day')
  findSchedule(
    @Param('day') day: string,
    @Query('identityNumber') identityNumber: string,
  ) {
    return this.employeeScheduleService.findSchedule(+day, identityNumber);
  }

  @ApiOkResponse({ type: EmployeeScheduleEntity })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeScheduleService.findOne(+id);
  }

  @ApiCreatedResponse({ type: EmployeeScheduleEntity })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeScheduleDto: UpdateEmployeeScheduleDto,
  ) {
    return this.employeeScheduleService.update(+id, updateEmployeeScheduleDto);
  }

  @ApiCreatedResponse({ type: EmployeeScheduleEntity })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeScheduleService.remove(+id);
  }
}
