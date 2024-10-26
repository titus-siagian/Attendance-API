import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ApiCustomResponse } from 'src/prisma/response/default.response';
import { AuthService } from './auth.service';
import { DeviceIdDto } from './dto/deviceId.dto';
import { LoginDto } from './dto/login.dto';
import { AuthEntity } from './entity/auth.entity';
import { DeviceIdEntity } from './entity/device.entity';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
@ApiExtraModels(AuthEntity, DeviceIdEntity)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCustomResponse(AuthEntity)
  @Post()
  login(@Body() login: LoginDto) {
    return this.authService.validate(login);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCustomResponse(DeviceIdEntity)
  @Get('device/:userid')
  findDeviceId(@Param('userid') id: string) {
    return this.authService.findDeviceId(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCustomResponse(DeviceIdEntity)
  @Post('device')
  addDeviceId(@Body() data: DeviceIdDto) {
    return this.authService.addDeviceId(data);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCustomResponse(DeviceIdEntity)
  @Delete('device/:userId')
  deleteDeviceId(@Param('userId') id: string) {
    return this.authService.deleteDeviceId(id);
  }
}
