import { Controller, Get, Post, Body, Res, UseGuards, Req } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

import { ClassService } from './class.service';
import { Class } from './class.entity';
import { createClassDto } from './class.dto/create-class.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('classes')
export class ClassController {
	constructor(private readonly classService: ClassService) {}

	@Get()
	async GetAllClasses(@Req() req: FastifyRequest): Promise<Class[]> {
		const result = await this.classService.getAll(req.user.id);
		return result;
	}

	@Post()
	async AddClass(@Res() res: FastifyReply, @Body() payload: createClassDto): Promise<void> {
		try {
			const newClass = await this.classService.CreateClass(payload);
			res.status(200).send(newClass);
		} catch (e) {
			res.status(500).send(e.message);
		}
	}
}
