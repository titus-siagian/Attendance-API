import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { get } from 'lodash';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import FcmDto from './dto/fcm.dto';
import { FcmService } from './fcm.service';

@ApiTags('FCM')
@UseGuards(JwtAuthGuard)
@Controller('fcm')
export class FcmController {
  constructor(private readonly fcmService: FcmService) {}

  @Patch(':userid/sync')
  sync(@Param('userid') userId: string, @Body() data: FcmDto) {
    return this.fcmService.sync(userId, get(data, 'token', ''));
  }

  @Patch(':userid/unsync')
  unsync(@Param('userid') userId: string) {
    return this.fcmService.unsync(userId);
  }
}
