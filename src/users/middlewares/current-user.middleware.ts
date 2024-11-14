import { NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CurrentUser } from '../decorators/current-user.decorator';
declare global {
  namespace Express {
    interface Request {
      currentUser: User;
    }
  }
}
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (token) {
      try {
        const decoded = this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET,
        });

        req.currentUser = await this.userService.findOne(decoded.userId);
        if (!req.currentUser) {
          throw new UnauthorizedException();
        }
      } catch (err) {
        console.error('Invalid token', err);
      }
    }

    next();
  }
}
