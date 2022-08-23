import { Verification } from './../common/entities/verification.entity';
import { UserService } from './../users/users.service';
import { AuthGuard } from './auth.guard';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, Verification])],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }, UserService],
})
export class AuthModule {}
