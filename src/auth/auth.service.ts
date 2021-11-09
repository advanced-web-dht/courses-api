import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { AccountService } from '../account/account.service';
import { Account } from '../account/account.entity';
import { signInDto } from './auth.dto/sign-in.dto';

@Injectable()
export class AuthService {
	constructor(private accountService: AccountService, private jwtService: JwtService) {}

	async validateUser(username: string, pass: string): Promise<unknown> {
		const user = await this.accountService.findUser(username);
		//const saltOrRounds = 10;
		//const hash = await bcrypt.hash(pass, saltOrRounds);
		if (user && user.password === pass) {
			//bcrypt.compare(user.password, hash)
			const { password, ...result } = user;
			return result;
		}
		return null;
	}
	async login(user: Account) {
		const payload = { username: user.username, sub: user.id };
		return {
			access_token: this.jwtService.sign(payload)
		};
	}
}
