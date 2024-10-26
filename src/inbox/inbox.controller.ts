import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiCustomResponseArray } from 'src/prisma/response/default.response';
import InboxEntity from './entities/inbox.entity';
import InboxQuery from './filters/inbox.filter';
import { InboxService } from './inbox.service';

@ApiTags('INBOX')
@UseGuards(JwtAuthGuard)
@Controller('inbox')
@ApiExtraModels(InboxEntity)
export class InboxController {
  constructor(private readonly inboxService: InboxService) {}

  @ApiCustomResponseArray(InboxEntity)
  @Get()
  findAll(@Query() query: InboxQuery) {
    return this.inboxService.getAll(query);
  }
}
