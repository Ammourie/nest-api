import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Query,
  Delete,
  Headers,
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
  findAll(@Headers() headers: any) {
    const access_token = headers.authorization?.split(' ')[1];
    return this.blogsService.findAll(access_token);
  }
  @Post('blogs/create')
  create(@Body() createBlogDto: CreateBlogDto, @Headers() headers: any) {
    const access_token = headers.authorization?.split(' ')[1];
    return this.blogsService.create(createBlogDto, access_token);
  }

  @Get('blogs/details')
  findOne(@Query('id') id: string, @Headers() headers: any) {
    const access_token = headers.authorization?.split(' ')[1];
    return this.blogsService.findOne(+id, access_token);
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
