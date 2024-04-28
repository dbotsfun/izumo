import '@gql/registers/enum.register';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ErrorHttpStatusCode, getErrorStatus } from '@constants/errors';
import { DATABASE } from '@constants/tokens';
import { DrizzlePostgresModule } from '@knaadh/nestjs-drizzle-postgres';
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { validate } from '@utils/index';
import type { Request, Response } from 'express';
import { schema } from './database/schema';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { BotModule } from './modules/bot/bot.module';
import { VanityModule } from './modules/vanity/vanity.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			validate
		}),

		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			playground: false,
			autoSchemaFile: true,
			introspection: true,
			fieldResolverEnhancers: ['guards'],
			cache: 'bounded',
			context: ({ req, res }: { req: Request; res: Response }) => ({
				req,
				res
			}),
			formatError: (error) => {
				let errorMessage =
					'An unknown error occurred. Please try again.';
				const originalError = error.extensions?.originalError as
					| { message: string }
					| string
					| string[];
				const isProd = process.env.NODE_ENV === 'production';

				const commonErrors: Record<string, string> = {
					BAD_USER_INPUT: 'Invalid input provided. Please try again.',
					INTERNAL_SERVER_ERROR:
						'An internal server error occurred. Please try again later.',
					UNAUTHENTICATED:
						'You are not authenticated to perform this action.'
				};

				const {
					stacktrace,
					status,
					code: _code = commonErrors.INTERNAL_SERVER_ERROR
				}: {
					stacktrace?: string;
					status?: keyof typeof ErrorHttpStatusCode;
					code?: string | number;
				} = error.extensions || {};

				if (typeof originalError === 'string') {
					errorMessage = originalError;
				} else if (typeof originalError === 'object') {
					errorMessage = Object.values(originalError)[0];
				}

				const commonError = commonErrors[_code];

				if (commonError) {
					errorMessage = commonError;
				}

				const [code, face] = getErrorStatus(status || _code);

				return {
					message: errorMessage,
					extensions: {
						code,
						face,
						originalError,
						stacktrace: !isProd ? stacktrace : undefined,
						status
					}
				};
			},
			plugins: [ApolloServerPluginLandingPageLocalDefault()]
		}),

		DrizzlePostgresModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			tag: DATABASE,
			useFactory: async (configService: ConfigService) => ({
				postgres: {
					url: configService.getOrThrow('DATABASE_URL')
				},
				config: { schema }
			})
		}),

		BotModule,
		AuthModule,
		VanityModule,
		AdminModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
