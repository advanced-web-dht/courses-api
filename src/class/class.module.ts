import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Class } from './class.entity';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';

@Module({
	imports: [SequelizeModule.forFeature([Class])],
	controllers: [ClassController],
	providers: [ClassService]
})
export class ClassModule {}
