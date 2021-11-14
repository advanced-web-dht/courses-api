import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Class } from './class.entity';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [SequelizeModule.forFeature([Class]), AuthModule],
	controllers: [ClassController],
	providers: [ClassService]
})
export class ClassModule {}
