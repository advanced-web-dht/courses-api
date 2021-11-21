import { Body, Controller, Get, Post, Res, Req, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { AuthGuard } from '@nestjs/passport';
import { FastifyRequest, FastifyReply } from 'fastify';

import { Account } from './account.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('accounts')
export class AccountController {
	constructor(private readonly accountService: AccountService) {}

	@Post('/check-email')
	async checkEmailExisted(@Res() res: FastifyReply, @Body('email') email: string): Promise<void> {
		const result = await this.accountService.checkEmailExisted(email);
		res.status(200).send({ isExisted: result });
	}

	@Post('/check-username')
	async checkUsernameExisted(@Res() res: FastifyReply, @Body('username') username: string): Promise<void> {
		const result = await this.accountService.checkUsernameExisted(username);
		res.status(200).send({ isExisted: result });
	}

	@Post()
	async updateAccount(@Req() req: FastifyRequest): Promise<Account> {
		const result = await this.accountService.UpdateAccount(req.body);
		return result;
	}
}
