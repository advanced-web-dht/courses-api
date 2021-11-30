import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Assignment } from './assignment.entity';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';
import { AuthModule } from '../auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../role/roles.guard';
import { ClassAccount } from '../entities/class-account.entity';

@Module({
	imports: [SequelizeModule.forFeature([Assignment, ClassAccount]), AuthModule],
	controllers: [AssignmentController],
	providers: [
		AssignmentService,
		{
			provide: APP_GUARD,
			useClass: RolesGuard
		}
	]
})
export class AssignmentModule {}
