import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsModule } from './blogs/blogs.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SessionModule } from 'nestjs-session';
import AppDataSource from 'data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    SessionModule.forRoot({
      session: { secret: process.env.SESSION_SECRET },
    }),

    TypeOrmModule.forRoot(AppDataSource.options),
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => {
    //     return {
    //       type: 'postgres',
    //       host: configService.get<string>('DB_HOST'),
    //       username: configService.get<string>('DB_USERNAME'),
    //       password: configService.get<string>('DB_PASSWORD'),
    //       database: configService.get<string>('DB_DATABASE'),
    //       entities: [Blog, User],
    //       synchronize: process.env.NODE_ENV === 'development',
    //     };
    //   },
    // }),

    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => {
    //     return {
    //       type: 'postgres',
    //       host: configService.get<string>('DB_HOST'),
    //       username: configService.get<string>('DB_USERNAME'),
    //       password: configService.get<string>('DB_PASSWORD'),
    //       database: configService.get<string>('DB_DATABASE'),
    //       entities: [Blog, User],
    //       synchronize: process.env.NODE_ENV === 'development',
    //     };
    //   },
    // }),

    BlogsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
