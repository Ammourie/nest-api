import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Query,
  Delete,
  Headers,
  Session,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
@ApiBearerAuth()
@Controller()
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}
  @Get('blogs')
  findAll(@Session() session: any) {
    return this.blogsService.findAll(session.user.id);
    }
  @Post('blogs/create')
  create(@Body() createBlogDto: CreateBlogDto, @Session() session: any) {
    return this.blogsService.create(createBlogDto, session.user.id);
  }

  @Get('blogs/details')
  findOne(@Query('id') id: string, @Session() session: any) {
    return this.blogsService.findOne(+id, session.user.id);
  }

  @Patch('blogs/update')
  update(
    @Query('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @Headers() headers: any,
  ) {
    const access_token = headers.authorization?.split(' ')[1];
    return this.blogsService.update(+id, updateBlogDto, access_token);
  }

  @Delete('blogs/delete')
  remove(@Query('id') id: string, @Headers() headers: any) {
    const access_token = headers.authorization?.split(' ')[1];
    return this.blogsService.remove(+id, access_token);
  }
}
