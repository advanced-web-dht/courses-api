import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PointPart } from '../point-part/point-part.entity';
import { Assignment } from './assignment.entity';
import { AddAssignmentDto } from './assignment.dto/add-assignment.dto';
import { UpdateAssignmentDto } from './assignment.dto/update-assignment.dto';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectModel(Assignment)
    private assignmentModel: typeof Assignment
  ) {}
  async addAssignment({ name, pointPartId, dateEnded }: AddAssignmentDto): Promise<Assignment> {
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
  async UpdateAssignment({ name, dateEnded, id }: UpdateAssignmentDto): Promise<Assignment> {
    const line = await this.assignmentModel.findOne({ where: { id: id } });
    line.set({
      name,
      dateEnded
    });
    await line.save();
    return line;
  }
  async getAllAssignment(classId: string): Promise<Assignment[]> {
    const class_assignment = await this.assignmentModel.findAll({
      include: {
        model: PointPart,
        where: {
          classID: classId
        }
      },
      attributes: ['pointPartId', 'name', 'dateEnded', 'id']
    });
    return class_assignment;
  }
}
