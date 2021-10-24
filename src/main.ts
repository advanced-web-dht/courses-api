import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true });

	const port = process.env.PORT;
	console.log(port);
	await app.listen(port);
	console.log(`> app start at port ${port}`);
}
bootstrap();
