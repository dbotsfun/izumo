import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HashService } from '../../services/hash.service';
import { AuthResolver } from './resolvers/auth.resolver';
import { AuthUserResolver } from './resolvers/user.resolver';
import { AuthService } from './services/auth.service';
import { AuthUserService } from './services/user.service';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';

/**
 * Represents the authentication module of the application.
 * This module provides the necessary services, resolvers, and modules for authentication.
 */
@Module({
	providers: [
		AuthService,
		AuthResolver,
		HashService,
		JwtStrategy,
		JwtRefreshStrategy,
		AuthUserResolver,
		AuthUserService
	],
	exports: [JwtModule, PassportModule],
	imports: [
		// Import the HttpModule to allow for making HTTP requests
		HttpModule,

		// Import the ConfigModule to allow for using the configuration service
		PassportModule.register({ defaultStrategy: 'jwt' }),

		// Import the JwtModule to allow for using JWT tokens
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (_configService: ConfigService) => ({
				secret: _configService.get<string>('JWT_SECRET_KEY'),
				signOptions: { expiresIn: '7d' }
			})
		})
	]
})
export class AuthModule {}
