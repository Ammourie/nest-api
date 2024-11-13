import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Query,
  Delete,
  Param,
  Session,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { BlogDto } from './dto/blog.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ApproveBlogDto } from './dto/approve-blog.dto';
import { AdminGuard } from '../auth/guards/admin.guard';
@ApiBearerAuth()
@Controller()
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}
  @Get('blogs')
  findAll(@CurrentUser() user: User) {
    return this.blogsService.findAll(user);
  }
  @Post('blogs/create')
  @Serialize(BlogDto)
  create(@Body() createBlogDto: CreateBlogDto, @CurrentUser() user: User) {
    return this.blogsService.create(createBlogDto, user);
  }

  @Get('blogs/details')
  findOne(@Query('id') id: string, @CurrentUser() user: User) {
    return this.blogsService.findOne(+id, user.id);
  }

  @Patch('blogs/update')
  update(
    @Query('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @CurrentUser() user: User,
  ) {
    return this.blogsService.update(+id, updateBlogDto, user.id);
  }

  @Delete('blogs/delete')
  remove(@Query('id') id: string, @CurrentUser() user: User) {
    return this.blogsService.remove(+id, user.id);
  }

  // @Patch('admin/blog/approve/:id')
  // @UseGuards(AdminGuard)
  // approveBlog(@Param('id') id: string, @Body() body: ApproveBlogDto) {
  //   return this.blogsService.approveBlog(+id, body.approved);
  // }
}
