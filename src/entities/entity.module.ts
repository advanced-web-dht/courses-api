import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ClassAccount } from './class-account.entity';

@Module({
	imports: [SequelizeModule.forFeature([ClassAccount])]
})
export class EntityModule {}
