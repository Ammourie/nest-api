import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsModule } from './blogs/blogs.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SessionModule } from 'nestjs-session';
import { DataSource, DataSourceOptions } from 'typeorm';
// import AppDataSource from 'data-source';

const path = require('path');
const config = require('dotenv').config({ path: '.env' });

const mode = process.env.MODE;

let dataSourceOptions: DataSourceOptions;

if (mode === 'development') {
  dataSourceOptions = {
    type: 'sqlite',
    database: 'db.sqlite',
    synchronize: false,
    entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
    migrations: ['migrations/*.{ts,js}'],
  };
} else if (mode === 'test' || mode === 'production') {
  dataSourceOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
    // extra: {
    //   ssl: true,
    // },
    synchronize: false,
    migrations: ['migrations/*.{ts,js}'],
  };
} else {
  throw new Error(`Unsupported environment: ${mode}`);
}

const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
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
