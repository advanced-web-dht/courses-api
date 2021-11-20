import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { AuthGuard } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';
import { Class } from '../class/class.entity';
import { Account } from './account.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('accounts')
export class AccountController {
	constructor(private readonly accountService: AccountService) {}
	@Post()
	async updateAccount(@Request() req: FastifyRequest): Promise<Account> {
		const result = await this.accountService.UpdateAccount(req.body);
		return result;
	}
}
