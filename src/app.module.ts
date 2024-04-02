import '@utils/graphql/registers/enum.register';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { FaceStatusCode } from '@constants/errors';
import { DATABASE } from '@constants/tokens';
import { DrizzlePostgresModule } from '@knaadh/nestjs-drizzle-postgres';
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { validate } from '@utils/index';
import type { Request, Response } from 'express';
import * as schema from './database/schema';
import { AuthModule } from './modules/auth/auth.module';
import { BotModule } from './modules/bot/bot.module';

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

				const commonErrors = {
					BAD_USER_INPUT: 'Invalid input provided. Please try again.',
					INTERNAL_SERVER_ERROR:
						'An internal server error occurred. Please try again later.',
					UNAUTHENTICATED:
						'You are not authenticated to perform this action.'
				};

				if (typeof originalError === 'string') {
					errorMessage = originalError;
				}

				if (typeof originalError === 'object') {
					errorMessage = Object.values(originalError)[0];
				}

				const commonError =
					commonErrors[
						error.extensions?.code as keyof typeof commonErrors
					];

				if (commonError) {
					errorMessage = commonError;
				}

				return {
					extensions: {
						code: error.extensions?.code,
						face: FaceStatusCode[
							error.extensions
								?.status as keyof typeof FaceStatusCode
						],
						originalError: error.extensions?.originalError,
						stacktrace: !isProd
							? error.extensions?.stacktrace
							: undefined,
						status: error.extensions?.status
					},
					message: errorMessage
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
		AuthModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
