import { Prisma } from '.prisma/client';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { cloneDeep, fromPairs, isEmpty, omit } from 'lodash';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
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
import { UserEntity } from './entities/user.entity';
import { UserQuery } from './filters/user.filter';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private mailService: MailService,
  ) {}

  selectUser: Prisma.UserSelect = {
    password: false,
    id: true,
    active: true,
    createdAt: true,
    updatedAt: true,
    identityNumber: true,
    name: true,
    email: true,
    avatarUrl: true,
    address: true,
    phone: true,
    role: true,
    blood: true,
    dateOfBirth: true,
    placeOfBirth: true,
    sex: true,
    location: true,
    position: true,
    companyId: true,
    divisionId: true,
    subdivisionId: true,
    departmentId: true,
    deviceId: true,
  };

  async create(createUserDto: CreateUserDto) {
    const userData = cloneDeep(createUserDto);
    createUserDto.password = await hash(createUserDto.password, 9);

    const where: Prisma.UserWhereUniqueInput = {};

    if (createUserDto.id) {
      where.id = createUserDto.id;
    } else if (createUserDto.email) {
      where.email = createUserDto.email;
    }

    const user = await this.prisma.user.upsert({
      where,
      update: createUserDto,
      create: createUserDto,
      select: this.selectUser,
    });
    this.mailService.welcomeEmail(userData);
    return {
      data: user,
    };
  }

  async findAll(query?: UserQuery) {
    const whereClause: Prisma.UserWhereInput = {
      role: 'USER',
    };

    let sorting: any;
    if (!isEmpty(query.sortBy)) {
      sorting = query.sortBy.map((x) => fromPairs([x.split(' ')]));
    }

    if (!isEmpty(query.id)) {
      whereClause.id = {
        contains: query.id,
      };
    }

    if (!isEmpty(query.email)) {
      whereClause.email = {
        contains: query.email,
      };
    }

    if (!isEmpty(query.name)) {
      whereClause.name = {
        contains: query.name,
      };
    }

    const data = await this.prisma.user.findMany({
      orderBy: !isEmpty(sorting) ? sorting : [],
      select: this.selectUser,
      where: whereClause,
      cursor: !isEmpty(query.cursor)
        ? {
            id: query.cursor,
          }
        : undefined,
      take: query.take,
      skip: query.skip,
    });

    const total = await this.prisma.user.count({
      where: whereClause,
    });

    return {
      data,
      total,
    };
  }

  async findOne(id: string) {
    const data = await this.prisma.user.findUnique({
      where: { id },
      select: this.selectUser,
    });

    if (!data) {
      throw new NotFoundException();
    }

    return {
      data,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await hash(updateUserDto.password, 9);
    }

    const data = await this.prisma.user.update({
      data: updateUserDto,
      where: { id },
      select: this.selectUser,
    });

    if (!data) {
      throw new NotFoundException();
    }

    return {
      data,
    };
  }

  async remove(id: string) {
    const findUser = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!findUser) {
      throw new NotFoundException('User tidak ditemukan');
    }

    // delete employe schedule
    const findSchedule = await this.prisma.employeeSchedule.findFirst({
      where: {
        userId: findUser.id,
      },
    });
    if (findSchedule) {
      await this.prisma.employeeSchedule.delete({
        where: {
          userId: findUser.id,
        },
      });
    }

    const data = await this.prisma.user.delete({
      where: { id },
      select: this.selectUser,
    });

    return {
      data,
    };
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException();
    }

    const validatePass = await compare(
      changePasswordDto.currentPassword,
      user.password,
    );
    if (!validatePass) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Kata sandi salah',
      });
    }
    changePasswordDto.newPassword = await hash(
      changePasswordDto.newPassword,
      9,
    );
    const updateUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: changePasswordDto.newPassword,
      },
    });
    const data = omit(updateUser, 'password');
    return {
      data,
    };
  }

  async forgotPassword(data: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      select: this.selectUser,
      where: {
        email: data.email,
      },
    });

    if (user) {
      const forgotPass = await this.prisma.forgotPassword.create({
        data: {
          claimed: false,
          userId: (user as UserEntity).id,
        },
      });
      this.mailService.forgotEmail((user as UserEntity).email, forgotPass);
      return { data: user };
    } else {
      throw new NotFoundException('Email tidak terdaftar');
    }
  }

  async verifyForgotPass(data: ClaimForgotPasswordDto) {
    const findForgotPass = await this.prisma.forgotPassword.findUnique({
      where: {
        id: data.id,
      },
    });

    if (!findForgotPass) {
      throw new NotFoundException('Tidak dapat memverifikasi token id');
    }

    if (findForgotPass.claimed) {
      throw new BadRequestException('Tidak dapat memproses perubahan password');
    }

    const password = await hash(data.newPassword, 9);

    const user = await this.prisma.user.update({
      where: {
        id: findForgotPass.userId,
      },
      data: {
        password: password,
      },
      select: this.selectUser,
    });

    await this.prisma.forgotPassword.update({
      where: {
        id: data.id,
      },
      data: {
        claimed: true,
      },
    });

    return {
      data: user,
    };
  }

  // division section
  async findAllDivision(companyId?: string) {
    const data = await this.prisma.division.findMany({
      where: {
        companyId,
      },
    });

    const total = await this.prisma.division.count({
      where: {
        companyId,
      },
    });

    return {
      data,
      total,
    };
  }

  async findDivision(id: string) {
    const data = await this.prisma.division.findUnique({ where: { id } });

    if (!data) {
      throw new NotFoundException();
    }

    return {
      data,
    };
  }

  async createDivision(createDivisionDto: CreateDivisonDto) {
    const data = await this.prisma.division.create({ data: createDivisionDto });
    return {
      data,
    };
  }

  async updateDivision(id: string, updateDivisionDto: UpdateDivisionDto) {
    const data = await this.prisma.division.update({
      data: updateDivisionDto,
      where: { id },
    });

    if (!data) {
      throw new NotFoundException();
    }

    return {
      data,
    };
  }

  async deleteDivision(id: string) {
    const data = await this.prisma.division.delete({ where: { id } });

    if (!data) {
      throw new NotFoundException();
    }

    return {
      data,
    };
  }

  // subdivision
  async findAllSubdivision(divisionId?: string) {
    const data = await this.prisma.subdivision.findMany({
      where: {
        divisionId,
      },
    });
    const total = await this.prisma.subdivision.count({
      where: {
        divisionId,
      },
    });

    return {
      data,
      total,
    };
  }

  async findSubdivision(id: string) {
    const data = await this.prisma.subdivision.findUnique({ where: { id } });

    if (!data) {
      throw new NotFoundException();
    }

    return {
      data,
    };
  }

  async createSubdivision(createSubdivisionDto: CreateSubdivisionDto) {
    const data = await this.prisma.subdivision.create({
      data: createSubdivisionDto,
    });
    return {
      data,
    };
  }

  async updateSubdivision(
    id: string,
    updateSubdivisionDto: UpdateSubdivisionDto,
  ) {
    const data = await this.prisma.subdivision.update({
      data: updateSubdivisionDto,
      where: { id },
    });

    if (!data) {
      throw new NotFoundException();
    }

    return {
      data,
    };
  }

  async deleteSubdivision(id: string) {
    const data = await this.prisma.subdivision.delete({ where: { id } });

    if (!data) {
      throw new NotFoundException();
    }

    return {
      data,
    };
  }

  // department
  async findAllDepartment(subdivisionId?: string) {
    const data = await this.prisma.department.findMany({
      where: { subdivisionId },
    });

    const total = await this.prisma.department.count({
      where: { subdivisionId },
    });

    return {
      data,
      total,
    };
  }

  async findDepartment(id: string) {
    const data = await this.prisma.department.findUnique({ where: { id } });
    if (!data) {
      throw new NotFoundException();
    }
    return { data };
  }

  async createDepartment(createDepartmentDto: CreateDepartmentDto) {
    const data = await this.prisma.department.create({
      data: createDepartmentDto,
    });
    return { data };
  }

  async updateDepartment(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    const data = await this.prisma.department.update({
      data: updateDepartmentDto,
      where: { id },
    });

    if (!data) {
      throw new NotFoundException();
    }

    return { data };
  }

  async deleteDepartment(id: string) {
    const data = await this.prisma.department.delete({ where: { id } });

    if (!data) {
      throw new NotFoundException();
    }

    return { data };
  }

  // company section
  async findAllCompany() {
    const data = await this.prisma.company.findMany();
    const total = await this.prisma.company.count();

    return {
      data,
      total,
    };
  }

  async findCompany(id: string) {
    const data = await this.prisma.company.findUnique({ where: { id } });

    if (!data) {
      throw new NotFoundException();
    }

    return { data };
  }

  async createCompany(createCompanyDto: CreateCompanyDto) {
    const data = await this.prisma.company.create({ data: createCompanyDto });

    if (!data) {
      throw new NotFoundException();
    }

    return { data };
  }

  async updateCompany(id: string, updateCompanyDto: UpdateCompanyDto) {
    const data = await this.prisma.company.update({
      data: updateCompanyDto,
      where: { id },
    });

    if (!data) {
      throw new NotFoundException();
    }

    return { data };
  }

  async deleteCompany(id: string) {
    const data = await this.prisma.company.delete({ where: { id } });
    return { data };
  }
}
