import { Module } from '@nestjs/common';
import { AnnouncementModule } from 'src/announcement/announcement.module';
import { TasksService } from './tasks.service';

@Module({
  imports: [AnnouncementModule],
  providers: [TasksService],
})
export class TasksModule {}
