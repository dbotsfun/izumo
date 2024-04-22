import { Reflector } from '@nestjs/core';

/**
 * Creates a decorator that can be used to decorate classes and methods with metadata.
 */
export const BotOwnerPermissions = Reflector.createDecorator<number[]>();
