import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import databaseConfigProd from './config/database/database.config.prod';
import databaseConfigDev from './config/database/database.config.dev';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClassModule } from './class/class.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env', load: [databaseConfigProd, databaseConfigDev] }),
		SequelizeModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: process.env.NODE_ENV === 'development' ? databaseConfigDev : databaseConfigProd
		}),
		ClassModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
