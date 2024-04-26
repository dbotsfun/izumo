import { Reflector } from '@nestjs/core';

/**
 * Decorator used to set the permissions for a user.
 */
export const UserPermissions = Reflector.createDecorator<number[]>();
