import { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
declare global {
  namespace Express {
    interface Request {
      currentUser: User;
      session: Session;
    }
    interface Session {
      user: User;
    }
  }
}
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { id } = req.session.user || {};

    if (id) {
      const user = await this.userService.findOne(id);
      req.currentUser = user;
    }

    next();
  }
}
