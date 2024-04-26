import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { AuthUserService } from '@modules/auth/services/user.service';
import { BotModule } from '@modules/bot/bot.module';
import { Module } from '@nestjs/common';
import { AdminPermissionsGuard } from './guards/user/permissions.guard';
import { AdminResolver } from './resolvers/admin.resolver';
import { AdminService } from './services/admin.service';
import { AdminBotService } from './services/bot.service';

@Module({
	imports: [BotModule],
	providers: [
		AdminBotService,
		AdminBotService,
		AdminService,
		AdminResolver,
		AdminPermissionsGuard,
		JwtAuthGuard,
		AuthUserService
	]
})
export class AdminModule {}
