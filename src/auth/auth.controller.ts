import { Controller, Get, Post, Request, UseGuards, Body } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AccountService } from '../account/account.service';
import { AccountLogin } from './auth.interface';
import { SignInGoogleDto } from './auth.dto/sign-in.dto';
import { MailService } from '../mail/mail.service';

declare module 'fastify' {
	interface FastifyRequest {
		user: AccountLogin;
	}
}

@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private accountService: AccountService,
		private emailService: MailService
	) {}

	@Post('/register')
	async register(@Body() req) {
		return this.authService.registerUser(req);
	}
	@Post('/signin/google')
	async loginGoogle(@Body() payload: SignInGoogleDto) {
		return this.authService.verifyAccessToken(payload);
	}

	@UseGuards(AuthGuard('local'))
	@Post('/signin')
	async login(@Request() req: FastifyRequest) {
		return this.authService.login(req.user);
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('/profile')
	async getProfile(@Request() req: FastifyRequest): Promise<unknown> {
		const user = await this.accountService.findUser(req.user.username);
		const { password, ...result } = user;
		return result;
	}
}
