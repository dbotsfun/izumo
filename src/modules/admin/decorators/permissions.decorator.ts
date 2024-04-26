import { Reflector } from '@nestjs/core';

export const UserPermissions = Reflector.createDecorator<number[]>();
