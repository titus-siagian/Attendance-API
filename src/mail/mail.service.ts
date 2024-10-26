import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ForgotPasswordEntity } from 'src/users/entities/forgot_password.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async welcomeEmail(user: CreateUserDto) {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Informasi akun aplikasi HR',
        template: 'welcome',
        context: {
          name: user.name,
          password: user.password,
          email: user.email,
        },
      });
    } catch (error) {
      console.log('error mail', error);
    }
  }

  async forgotEmail(email: string, data: ForgotPasswordEntity) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Lupa kata sandi',
        template: 'forgot_password',
        context: {
          id: data.id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
