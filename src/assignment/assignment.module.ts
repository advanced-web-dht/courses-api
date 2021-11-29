import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Assignment } from './assignment.entity';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';

@Module({
	imports: [SequelizeModule.forFeature([Assignment])],
	controllers: [AssignmentController],
	providers: [AssignmentService]
})
export class AssignmentModule {}
