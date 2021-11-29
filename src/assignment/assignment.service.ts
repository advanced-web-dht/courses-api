import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PointPart } from '../point-part/point-part.entity';
import { Assignment } from './assignment.entity';
import { PointPart_checkDto } from '../point-part/point-part.dto/point-part_check.dto';
import { Assignment_checkDto } from './assignment.dto/assignment_check.dto';

@Injectable()
export class AssignmentService {
	constructor(
		@InjectModel(Assignment)
		private assignmentModel: typeof Assignment
	) {}
	async addAsignment({ name, pointPartId, dateEnded }: Assignment_checkDto): Promise<Assignment> {
		const info = {
			pointPartId,
			name,
			dateEnded
		};
		const newAssignment = await this.assignmentModel.create(info);
		return newAssignment;
	}
	async deleteAssignment(id: string): Promise<void> {
		await this.assignmentModel.destroy({
			where: {
				id: id
			}
		});
	}
}
