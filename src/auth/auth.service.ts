import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { DeviceIdDto } from './dto/deviceId.dto';
import { LoginDto } from './dto/login.dto';
import { AuthEntity } from './entity/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validate(login: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: login.email },
    });

    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Email / kata sandi anda salah',
      });
    }

    const validatePass = await compare(login.password, user.password);

    if (!validatePass) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Email / kata sandi anda salah',
      });
    }

    const authEntity = new AuthEntity({
      accessToken: this.jwtService.sign(user),
    });
    return {
      data: authEntity,
    };
  }

  validateUser(user: UserEntity) {
    return this.prisma.user.findUnique({
      where: { identityNumber: user.identityNumber },
    });
  }

  async findDeviceId(id: string) {
    const findUser = await this.prisma.user.findUnique({
      where: { id },
      select: {
        deviceId: true,
      },
    });
    if (!findUser) {
      return {
        deviceid: null,
      };
    }
    return {
      data: findUser,
    };
  }

  async addDeviceId(data: DeviceIdDto) {
    const response = await this.prisma.user.update({
      where: {
        id: data.userId,
      },
      data: {
        deviceId: data.id,
      },
      select: {
        deviceId: true,
      },
    });
    return {
      data: response,
    };
  }

  async deleteDeviceId(id: string) {
    const data = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        deviceId: null,
      },
      select: {
        deviceId: true,
      },
    });

    return {
      data,
    };
  }
}
