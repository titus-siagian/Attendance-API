import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiCustomResponse,
  ApiCustomResponseArray,
} from 'src/prisma/response/default.response';
import { AnnouncementService } from './announcement.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { AnnouncementEntity } from './entities/announcement.entity';
import { AttachmentEntity } from './entities/attachment.entity';
import AnnouncementQuery from './filters/announcement.filter';

@ApiTags('Announcements')
@Controller('announcement')
@ApiExtraModels(AnnouncementEntity, AttachmentEntity)
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @ApiCustomResponse(AnnouncementEntity)
  @Post()
  create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    return this.announcementService.create(createAnnouncementDto);
  }

  @ApiCustomResponseArray(AnnouncementEntity)
  @Get()
  findAll(@Query() query: AnnouncementQuery) {
    return this.announcementService.findAll(query);
  }

  @ApiCustomResponse(AttachmentEntity)
  @Post(':id/attachment')
  addAttachment(@Body() createAttachmentDto: CreateAttachmentDto) {
    return this.announcementService.addAttachment(createAttachmentDto);
  }

  @ApiCustomResponseArray(AttachmentEntity)
  @Get(':id/attachment')
  getAllAttachment(@Param('id', ParseIntPipe) id: number) {
    return this.announcementService.getAllAttachment(id);
  }

  @ApiCustomResponse(AnnouncementEntity)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.announcementService.findOne(+id);
  }

  @ApiCustomResponse(AnnouncementEntity)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ) {
    return this.announcementService.update(+id, updateAnnouncementDto);
  }

  @ApiCustomResponse(AnnouncementEntity)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.announcementService.remove(+id);
  }

  @ApiCustomResponse(AttachmentEntity)
  @UseGuards(JwtAuthGuard)
  @Delete('attachment/:id')
  removeAttachment(@Param('id') id: string) {
    return this.announcementService.removeAttachment(id);
  }
}
