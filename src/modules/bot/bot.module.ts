import { PaginatorService } from '@/services/paginator.service';
import { WebhookService } from '@/services/webhook.service';
import { AUTH_AND_OWNER_PERMISSIONS } from '@constants/tokens';
import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { AndGuard } from '@nest-lab/or-guard';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { InternalGuard } from '@utils/guards/internal.guard';
import { BotOwnerPermissionsGuards } from './guards/permissions.guard';
import { ApiKeyResolver } from './resolvers/apikey.resolver';
import { BotResolver } from './resolvers/bot.resolver';
import { BotFields } from './resolvers/fields/bot.fields';
import { BotOwnerFields } from './resolvers/fields/owner.fields';
import { BotTagFields } from './resolvers/fields/tag.fields';
import { BotOwnerResolver } from './resolvers/owner.resolver';
import { BotTagResolver } from './resolvers/tag.resolver';
import { BotVoteResolver } from './resolvers/vote.resolver';
import { BotWebhookResolver } from './resolvers/webhook.resolver';
import { ApiKeyService } from './services/apikey.service';
import { BotService } from './services/bot.service';
import { BotOwnerService } from './services/owner.service';
import { BotTagService } from './services/tag.service';
import { BotVoteService } from './services/vote.service';
import { BotWebhookService } from './services/webhook.service';
import { JwtApikeyStrategy } from './strategy/apikey.strategy';

@Module({
	providers: [
		BotService,
		BotResolver,
		BotFields,
		BotOwnerService,
		BotOwnerResolver,
		BotOwnerFields,
		BotTagService,
		BotTagFields,
		WebhookService,
		PaginatorService,
		BotTagResolver,
		BotVoteResolver,
		BotVoteService,
		BotWebhookService,
		BotWebhookResolver,
		ApiKeyService,
		ApiKeyResolver,
		JwtApikeyStrategy,
		InternalGuard,
		JwtAuthGuard,
		{
			provide: AUTH_AND_OWNER_PERMISSIONS,
			useClass: AndGuard([JwtAuthGuard, BotOwnerPermissionsGuards])
		}
	],
	imports: [
		HttpModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				secret: configService.getOrThrow<string>(
					'JWT_APIKEY_SECRET_KEY'
				)
			})
		})
	],
	exports: [
		BotService,
		BotOwnerService,
		BotTagService,
		WebhookService,
		PaginatorService
	]
})
export class BotModule {}
