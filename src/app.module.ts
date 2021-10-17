import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfigProd from './config/database/database.config.prod';
import databaseConfigDev from './config/database/database.config.dev';
import { CoursesModule } from './course/course.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env', load: [databaseConfigProd, databaseConfigDev] }),
		SequelizeModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: process.env.NODE_ENV === 'development' ? databaseConfigDev : databaseConfigProd
		}),
		CoursesModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
