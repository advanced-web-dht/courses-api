import { Body, Controller, Get, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { AssignmentService } from './assignment.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../role/roles.decorator';
import { Role } from '../role/role.enum';
import { UpdateAssignmentDto } from './assignment.dto/update-assignment.dto';
import { AddAssignmentDto } from './assignment.dto/add-assignment.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('assignment')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Post('/add')
  @Roles(Role.owner, Role.teacher)
  async AddAssignment(@Res() res: FastifyReply, @Body() req: AddAssignmentDto): Promise<void> {
    try {
      const result = await this.assignmentService.addAssignment(req);
      res.status(200).send({ isSuccess: true, assignment: result });
    } catch (err) {
      if (err.parent.errno === 1062) {
        res.status(409).send({ isSuccess: false });
      } else {
        res.status(500).send({ isSuccess: false });
      }
    }
  }

  // Need improve
  @Roles(Role.owner, Role.teacher)
  @Put('/:id')
  async DelAssignment(@Res() res: FastifyReply, @Param('id') id: string): Promise<void> {
    await this.assignmentService.deleteAssignment(id);
    res.status(200).send({ isSuccess: true });
  }

  @Roles(Role.owner, Role.teacher)
  @Put()
  async updateAssignment(@Res() res: FastifyReply, @Body() body: UpdateAssignmentDto): Promise<void> {
    try {
      await this.assignmentService.UpdateAssignment(body);
      res.status(201).send({ isSuccess: true });
    } catch (err) {
      if (err.parent.errno === 1062) {
        res.status(409).send({ isSuccess: false });
      } else {
        res.status(500).send({ isSuccess: false });
      }
    }
  }

  @Get('/:classID')
  async GetPointStructure(@Res() res: FastifyReply, @Param('classID') id: string): Promise<void> {
    const result = await this.assignmentService.getAllAssignment(id);
    res.status(200).send(result);
  }
}
