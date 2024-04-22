import type { Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Omit guards decorator.
 * @param opts The guards to omit.
 * @returns The omit guards decorator.
 */
export const OmitGuards = Reflector.createDecorator<Type[]>();
