import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/public.decorator';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Public()
  @ApiExcludeEndpoint(true)
  @Get('/')
  getHello(): string {
    return this.appService.getHello();
  }
}
