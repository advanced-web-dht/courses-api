import { Body, Controller, Delete, Param, Post, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { AssignmentService } from './assignment.service';

@Controller('assignment')
export class AssignmentController {
	constructor(private readonly assignmentService: AssignmentService) {}

	@Post('/add')
	async AddAssignment(@Res() res: FastifyReply, @Body() req): Promise<void> {
		try {
			const result = await this.assignmentService.addAsignment(req);
			res.status(201).send({ isSuccess: true, assigntment: result });
		} catch (err) {
			if (err.parent.errno === 1062) {
				res.status(409).send({ isSuccess: false });
			} else {
				res.status(500).send({ isSuccess: false });
			}
		}
	}
	@Delete('/:id')
	async DelAssignment(@Res() res: FastifyReply, @Param('id') id: string): Promise<void> {
		await this.assignmentService.deleteAssignment(id);
		res.status(200).send({ isSuccess: true });
	}
}
