import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AccountService } from '../account/account.service';
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService, private accountService: AccountService) {}

	@UseGuards(AuthGuard('local'))
	@Post('/login')
	async login(@Request() req) {
		return this.authService.login(req.body);
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('/profile')
	async getProfile(@Request() req): Promise<unknown> {
		const user = await this.accountService.findUser(req.user.username);
		const { password, ...result } = user;
		return result;
	}
}
