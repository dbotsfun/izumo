import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { validate } from '@utils/index';
import type { Request, Response } from 'express';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			envFilePath: [
				'.env',
				'.env.local',
				'.env.development',
				'.env.development.local'
			],
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
			plugins: [ApolloServerPluginLandingPageLocalDefault()]
		})
	],
	controllers: [],
	providers: []
})
export class AppModule {}
