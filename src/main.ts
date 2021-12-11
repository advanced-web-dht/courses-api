import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { corsConfig } from './config/cors/cors.config';

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), { cors: corsConfig });

	app.useGlobalPipes(new ValidationPipe());

	const port = process.env.PORT;
	await app.listen(port, '0.0.0.0');

	console.log(`> App start at port ${port}`);
}
bootstrap().then();
