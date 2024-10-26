import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { env } from 'process';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.JWT_SECRET,
    });
  }

  async validate(payload: UserEntity) {
    const user = await this.authService.validateUser(payload);

    if (!user) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    }

    return user;
  }
}
