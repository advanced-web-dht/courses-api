import { Body, Controller, Delete, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AssignmentService } from './assignment.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../role/roles.decorator';
import { Role } from '../role/role.enum';

@Controller('assignment')
@UseGuards(AuthGuard('jwt'))
export class AssignmentController {
	constructor(private readonly assignmentService: AssignmentService) {}

	@Post('/add')
	@Roles(Role.owner, Role.teacher)
	async AddAssignment(@Res() res: FastifyReply, @Body() req, @Req() body: FastifyRequest): Promise<void> {
		try {
			const result = await this.assignmentService.addAsignment(req);
			res.status(200).send({ isSuccess: true, assignment: result });
		} catch (err) {
			if (err.parent.errno === 1062) {
				res.status(409).send({ isSuccess: false });
			} else {
				res.status(500).send({ isSuccess: false });
			}
		}
	}

	@Roles(Role.owner, Role.teacher)
	@Delete('/:id')
	async DelAssignment(@Res() res: FastifyReply, @Param('id') id: string): Promise<void> {
		await this.assignmentService.deleteAssignment(id);
		res.status(200).send({ isSuccess: true });
	}

	@Roles(Role.owner, Role.teacher)
	@Put()
	async updateAssignment(@Res() res, @Body() req): Promise<void> {
		try {
			await this.assignmentService.UpdateAssignment(req);
			res.status(201).send({ isSuccess: true });
		} catch (err) {
			if (err.parent.errno === 1062) {
				res.status(409).send({ isSuccess: false });
			} else {
				res.status(500).send({ isSuccess: false });
			}
		}
	}
}
