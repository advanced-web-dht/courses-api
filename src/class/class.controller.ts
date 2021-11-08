import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { ClassService } from './class.service';
import { Class } from './class.entity';
import { createClassDto } from './class.dto/create-class.dto';

@Controller('classes')
export class ClassController {
	constructor(private readonly classService: ClassService) {}

	@Get()
	async GetAllClasses(): Promise<Class[]> {
		return this.classService.getAll();
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
