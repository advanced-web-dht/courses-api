import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Class } from './class.entity';
import { EntityModule } from '../entities/entity.module';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { AuthModule } from '../auth/auth.module';
import { ClassAccount } from '../entities/class-account.entity';

@Module({
	imports: [SequelizeModule.forFeature([Class]), SequelizeModule.forFeature([ClassAccount]), AuthModule],
	controllers: [ClassController],
	providers: [ClassService]
})
export class ClassModule {}
