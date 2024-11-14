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
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { BlogDto } from './dto/blog.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ApproveBlogDto } from './dto/approve-blog.dto';
import { AdminGuard } from '../auth/guards/admin.guard';
@ApiBearerAuth()
@Controller('api/blogs')
@Controller()
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @ApiQuery({
    name: 'id',
    type: String,
    description: 'A parameter. Optional',
    required: false,
  })
  @Get()
  findAll(@CurrentUser() user: User, @Query('id') id?: string) {
    if (id) return this.blogsService.findOne(+id, user.id);
    else return this.blogsService.findAll(user);
  }
  @Post('create')
  @Serialize(BlogDto)
  create(@Body() createBlogDto: CreateBlogDto, @CurrentUser() user: User) {
    return this.blogsService.create(createBlogDto, user);
  }

  @Patch('update')
  update(
    @Query('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @CurrentUser() user: User,
  ) {
    return this.blogsService.update(+id, updateBlogDto, user.id);
  }

  @Delete('delete')
  remove(@Query('id') id: string, @CurrentUser() user: User) {
    return this.blogsService.remove(+id, user.id);
  }

  // @Patch('admin/blog/approve/:id')
  // @UseGuards(AdminGuard)
  // approveBlog(@Param('id') id: string, @Body() body: ApproveBlogDto) {
  //   return this.blogsService.approveBlog(+id, body.approved);
  // }
}
