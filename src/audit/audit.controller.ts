import { Controller, Get, Query } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ApiCustomResponseArray } from 'src/prisma/response/default.response';
import { AuditService } from './audit.service';
import AuditEntity from './entities/audit.entity';
import AuditQuery from './filters/audit.filters';

@ApiTags('Audit')
@ApiExtraModels(AuditEntity)
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @ApiCustomResponseArray(AuditEntity)
  @Get('/')
  getAll(@Query() query: AuditQuery) {
    return this.auditService.getAll(query);
  }
}
