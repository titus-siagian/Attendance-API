import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AnnouncementModule } from './announcement/announcement.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttendanceModule } from './attendance/attendance.module';
import { AuthModule } from './auth/auth.module';
import { FamilyModule } from './family/family.module';
import { FilesController } from './files/files.controller';
import { MasterLocationsModule } from './master-locations/master-locations.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { EmployeeScheduleModule } from './employee-schedule/employee-schedule.module';
import { MailModule } from './mail/mail.module';
import { QuestionModule } from './question/question.module';
import { FcmModule } from './fcm/fcm.module';
import { InboxModule } from './inbox/inbox.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'ess_web/dist'),
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    MasterLocationsModule,
    AnnouncementModule,
    AttendanceModule,
    FamilyModule,
    EmployeeScheduleModule,
    MailModule,
    QuestionModule,
    FcmModule,
    InboxModule,
    TasksModule,
    AuditModule,
  ],
  controllers: [AppController, FilesController],
  providers: [AppService],
})
export class AppModule {}
