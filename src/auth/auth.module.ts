import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService],
  imports: [UsersModule, TypeOrmModule.forFeature([User])],
})
export class AuthModule {}
