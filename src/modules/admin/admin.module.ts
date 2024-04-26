import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { AuthUserService } from '@modules/auth/services/user.service';
import { BotModule } from '@modules/bot/bot.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { WebhookService } from '@services/webhook.service';
import { AdminPermissionsGuard } from './guards/user/permissions.guard';
import { AdminResolver } from './resolvers/admin.resolver';
import { AdminBotResolver } from './resolvers/bot.resolver';
import { AdminService } from './services/admin.service';
import { AdminBotService } from './services/bot.service';

@Module({
	imports: [BotModule, HttpModule],
	providers: [
		AdminBotResolver,
		AdminBotService,
		AdminService,
		AdminResolver,
		AdminPermissionsGuard,
		JwtAuthGuard,
		AuthUserService,
		WebhookService
	]
})
export class AdminModule {}
