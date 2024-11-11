import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsersService } from '../users.service';
import { plainToClass } from 'class-transformer';
@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private readonly userService: UsersService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const { id } = request.session.user || {};

    if (id) {
      const user = await this.userService.findOne(id);
      request.currentUser = user;
    }
    return next.handle();
  }
}
