import { Controller, Get, Post, Body, Res, Param, Request } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

import { ClassService } from './class.service';
import { Class } from './class.entity';
import { createClassDto } from './class.dto/create-class.dto';
import { AuthGuard } from '@nestjs/passport';

// @UseGuards(AuthGuard('jwt'))
@Controller('classes')
export class ClassController {
	constructor(private readonly classService: ClassService) {}

	@Get()
	async GetAllClasses(@Request() req: FastifyRequest): Promise<Class[]> {
		const result = await this.classService.getAll(req.user.id);
		return result;
	}

	@Post()
	async AddClass(@Res() res: FastifyReply, @Body() payload: createClassDto, @Request() req): Promise<void> {
		try {
			const newClass = await this.classService.CreateClass(payload);
			await this.classService.CreateAccountClass(req.user.id, newClass.id);
			res.status(200).send(newClass);
		} catch (e) {
			res.status(500).send(e.message);
		}
	}
	@Get('/:classId/:role')
	async register(@Param() params) {
		return this.classService.getMemberByRole(params.classId, params.role);
	}
}
