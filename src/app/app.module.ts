import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsModule } from './blogs/blogs.module';
import { UsersModule } from './users/users.module';
import { Blog } from './blogs/entities/blog.entity';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { SessionModule } from 'nestjs-session';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    SessionModule.forRoot({
      session: { secret: process.env.SESSION_SECRET },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          entities: [Blog, User],
          synchronize: process.env.NODE_ENV === 'development',
        };
      },
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: process.env.DB_HOST as string,
    //   username: process.env.DB_USERNAME as string,
    //   password: process.env.DB_PASSWORD as string,
    //   database: process.env.DB_DATABASE as string,
    //   entities: [Blog, User],
    //   synchronize: process.env.APP_ENV === 'development',
    // }),
    BlogsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
