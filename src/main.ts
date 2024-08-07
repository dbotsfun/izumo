import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	app.set('trust proxy', true);

	app.enableCors({
		origin: [/^(.*)/],
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		preflightContinue: false,
		credentials: true,
		allowedHeaders:
			'mode,Mode,Origin,X-Requested-With,Content-Type,Accept,Authorization,authorization,X-Forwarded-for,apollographql-client-name'
	});

	await app.listen(process.env.API_PORT || 3000);
}

bootstrap();
