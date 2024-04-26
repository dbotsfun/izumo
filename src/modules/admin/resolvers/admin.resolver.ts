import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { AdminPermissionsGuard } from '../guards/user/permissions.guard';

@Resolver()
@UseGuards(JwtAuthGuard, AdminPermissionsGuard)
export class AdminResolver {}
