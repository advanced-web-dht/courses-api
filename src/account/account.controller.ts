import { Controller, Body, Post, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { AccountService } from './account.service';

@Controller('accounts')
export class AccountController {
	constructor(private readonly classService: AccountService) {}

	@Post('/check-email')
	async checkEmailExisted(@Res() res: FastifyReply, @Body('email') email: string): Promise<void> {
		const result = await this.classService.checkEmailExisted(email);
		res.status(200).send({ isExisted: result });
	}

	@Post('/check-username')
	async checkUsernameExisted(@Res() res: FastifyReply, @Body('username') username: string): Promise<void> {
		const result = await this.classService.checkUsernameExisted(username);
		res.status(200).send({ isExisted: result });
	}
}
