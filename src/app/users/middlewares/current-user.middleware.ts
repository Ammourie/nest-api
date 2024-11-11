import { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    //@ts-ignore
    const { id } = req.session.user || {};

    if (id) {
      const user = await this.userService.findOne(id);
      //@ts-ignore
      req.currentUser = user;
    }

    next();
  }
}
