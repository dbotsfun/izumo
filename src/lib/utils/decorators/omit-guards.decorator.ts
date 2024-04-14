import { Reflector } from '@nestjs/core';

// biome-ignore lint/complexity/noBannedTypes: I know what i'm doing
export const OmitGuards = Reflector.createDecorator<Function[]>();
