import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiCustomResponseArray,
  ApiCustomResponse,
} from 'src/prisma/response/default.response';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ClaimForgotPasswordDto } from './dto/claim-forgot-password.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { CreateDivisonDto } from './dto/create-division.dto';
import { CreateSubdivisionDto } from './dto/create-subdivision.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { UpdateDivisionDto } from './dto/update-division.dto';
import { UpdateSubdivisionDto } from './dto/update-subdivision.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CompanyEntity } from './entities/company.entity';
import { DepartmentEntity } from './entities/department.entity.';
import { DivisonEntity } from './entities/division.entity';
import { SubdivisionEntity } from './entities/subdivision.entity';
import { UserEntity } from './entities/user.entity';
import { UserQuery } from './filters/user.filter';
import { UsersService } from './users.service';

@ApiTags('User')
@Controller('users')
@ApiBearerAuth()
@ApiExtraModels(
  UserEntity,
  CompanyEntity,
  DivisonEntity,
  SubdivisionEntity,
  DepartmentEntity,
)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiCustomResponse(UserEntity)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCustomResponseArray(UserEntity)
  @Get()
  findAll(@Query() query: UserQuery) {
    return this.usersService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCustomResponse(UserEntity)
  @Get('me')
  me(@Req() request: Request) {
    const token = request.headers.authorization.split(' ')[1];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = this.jwtService.verify(token);
    return this.usersService.findOne(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCustomResponseArray(DivisonEntity)
  @Get('/division')
  findAllDivision(@Query('companyId') companyId: string) {
    return this.usersService.findAllDivision(companyId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCustomResponse(DivisonEntity)
  @Get('/division/:id')
  findDivision(@Param('id') id: string) {
    return this.usersService.findDivision(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCustomResponse(DivisonEntity)
  @Post('/division')
  createDivision(@Body() createDivisionDto: CreateDivisonDto) {
    return this.usersService.createDivision(createDivisionDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCustomResponse(DivisonEntity)
  @Patch('/division/:id')
  updateDivision(
    @Param('id') id: string,
    @Body() updateDivisionDto: UpdateDivisionDto,
  ) {
    return this.usersService.updateDivision(id, updateDivisionDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCustomResponse(DivisonEntity)
  @Delete('/division/:id')
  deleteDivision(@Param('id') id: string) {
    return this.usersService.deleteDivision(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCustomResponseArray(SubdivisionEntity)
  @Get('/subdivision')
  findAllSubdivision(@Query('divisionId') divisionId: string) {
    return this.usersService.findAllSubdivision(divisionId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCustomResponse(SubdivisionEntity)
  @Get('/subdivision/:id')
  findSubdivision(@Param('id') id: string) {
    return this.usersService.findSubdivision(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCustomResponse(SubdivisionEntity)
  @Post('/subdivision')
  createSubdivision(@Body() createSubdivisionDto: CreateSubdivisionDto) {
    return this.usersService.createSubdivision(createSubdivisionDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCustomResponse(SubdivisionEntity)
  @Patch('/subdivision/:id')
  updateSubdivision(
    @Param('id') id: string,
    @Body() updateSubdivisionDto: UpdateSubdivisionDto,
  ) {
    return this.usersService.updateSubdivision(id, updateSubdivisionDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCustomResponse(SubdivisionEntity)
  @Delete('/subdivision/:id')
  deleteSubdivision(@Param('id') id: string) {
    return this.usersService.deleteSubdivision(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCustomResponseArray(DepartmentEntity)
  @Get('/department')
  findAllDepartment(@Query('subdivisionId') subdivisionId: string) {
    return this.usersService.findAllDepartment(subdivisionId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCustomResponse(DepartmentEntity)
  @Get('/department/:id')
  findDepartment(@Param('id') id: string) {
    return this.usersService.findDepartment(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCustomResponse(DepartmentEntity)
  @Post('/department')
  createDepartment(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.usersService.createDepartment(createDepartmentDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCustomResponse(DepartmentEntity)
  @Patch('/department/:id')
  updateDepartment(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.usersService.updateDepartment(id, updateDepartmentDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCustomResponse(DepartmentEntity)
  @Delete('/department/:id')
  deleteDepartment(@Param('id') id: string) {
    return this.usersService.deleteDepartment(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCustomResponseArray(CompanyEntity)
  @Get('/company')
  findAllCompany() {
    return this.usersService.findAllCompany();
  }

  @UseGuards(JwtAuthGuard)
  @ApiCustomResponse(CompanyEntity)
  @Get('/company/:id')
  findCompany(@Param('id') id: string) {
    return this.usersService.findCompany(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCustomResponse(CompanyEntity)
  @Post('/company')
  createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    return this.usersService.createCompany(createCompanyDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCustomResponse(CompanyEntity)
  @Patch('/company/:id')
  updateCompany(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.usersService.updateCompany(id, updateCompanyDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCustomResponse(CompanyEntity)
  @Delete('/company/:id')
  deleteCompany(@Param('id') id: string) {
    return this.usersService.deleteCompany(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCustomResponse(UserEntity)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiCustomResponse(UserEntity)
  @Post('/forgot-password')
  forgotPassword(@Body() email: ForgotPasswordDto) {
    return this.usersService.forgotPassword(email);
  }

  @ApiCustomResponse(UserEntity)
  @Post('/forgot-password/claim')
  claimForgotPassword(@Body() data: ClaimForgotPasswordDto) {
    return this.usersService.verifyForgotPass(data);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCustomResponse(UserEntity)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCustomResponse(UserEntity)
  @Patch(':id/change-password')
  changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(id, changePasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: UserEntity })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
