import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsModule } from './blogs/blogs.module';
import { UsersModule } from './users/users.module';
import { Blog } from './blogs/entities/blog.entity';
import { User } from './users/entities/user.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: "127.0.0.1",
      username: "postgres",
      password: "asd123",
      database: "nest",
      entities: [Blog, User],
      synchronize: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    BlogsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
