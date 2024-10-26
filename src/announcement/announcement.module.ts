import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { InboxService } from 'src/inbox/inbox.service';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementService } from './announcement.service';

@Module({
  imports: [HttpModule],
  controllers: [AnnouncementController],
  providers: [AnnouncementService, InboxService],
  exports: [AnnouncementService],
})
export class AnnouncementModule {}
