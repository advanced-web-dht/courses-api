import {
	Controller,
	Get,
	Post,
	Body,
	Res,
	UseGuards,
	Request,
	Query,
	UnauthorizedException,
	Param
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthGuard } from '@nestjs/passport';

import { ClassService } from './class.service';
import { Class } from './class.entity';
import { createClassDto } from './class.dto/create-class.dto';
import { MailService } from '../mail/mail.service';

@Controller('classes')
export class ClassController {
	constructor(private readonly classService: ClassService, private readonly mailService: MailService) {}

	@UseGuards(AuthGuard('jwt'))
	@Get()
	async GetAllClasses(@Request() req: FastifyRequest): Promise<Class[]> {
		const result = await this.classService.getAll(req.user.id);
		return result;
	}

	@UseGuards(AuthGuard('jwt'))
	@Post()
	async AddClass(@Res() res: FastifyReply, @Body() payload: createClassDto, @Request() req): Promise<void> {
		try {
			const newClass = await this.classService.CreateClass(payload);
			await this.classService.AddMember(req.user.id, newClass.id, 'owner');
			res.status(200).send(newClass);
		} catch (e) {
			res.status(500).send(e.message);
		}
	}

	@UseGuards(AuthGuard('jwt'))
	@Post('/:code/invite')
	async InviteStudent(
		@Res() res: FastifyReply,
		@Param('code') code: string,
		@Body('email') email: string
	): Promise<void> {
		try {
			const inviteLink = `${process.env.CLIENT_URL}/enroll/${code}`;
			await this.mailService.sendInvitationMail(email, inviteLink);
			res.status(200).send({ isSuccess: true });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Internal server error' });
		}
	}

	@UseGuards(AuthGuard('jwt'))
	@Post('/:classId/students')
	async AddStudents(
		@Request() { user }: FastifyRequest,
		@Res() res: FastifyReply,
		@Param('classId') classId: number
	): Promise<void> {
		try {
			await this.classService.AddMember(user.id, classId, 'student');
			res.status(201).send({ isSuccess: true });
		} catch (e) {
			res.status(500).send(e.message);
		}
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('/:classId/:role')
	async register(@Param() params) {
		return this.classService.getMemberByRole(params.classId, params.role);
	}

	@Get('/:code/enroll')
	async GetClassToEnroll(@Param('code') code: string): Promise<Class> {
		const result = await this.classService.getClassByCodeToEnroll(code);
		return result;
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('/:code')
	async GetClass(@Param('code') code: string): Promise<Class> {
		const result = await this.classService.getClassByCode(code);
		return result;
	}
}
