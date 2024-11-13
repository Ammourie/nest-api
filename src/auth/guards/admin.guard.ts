import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Router } from 'express';
import { AuthService } from '../auth.service';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!request.currentUser) return false;

    return request.currentUser.isAdmin;
  }
}
