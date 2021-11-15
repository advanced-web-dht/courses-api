import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios, { AxiosError } from 'axios';
import * as bcrypt from 'bcrypt';

import { AccountService } from '../account/account.service';
import { AccountLogin } from './auth.interface';
import { SignInGoogleDto } from './auth.dto/sign-in.dto';

@Injectable()
export class AuthService {
	constructor(private accountService: AccountService, private jwtService: JwtService) {}

	async validateUser(username: string, password: string): Promise<AccountLogin | null> {
		const user = await this.accountService.findUser(username);
		//const saltOrRounds = 10;
		//const hash = await bcrypt.hash(pass, saltOrRounds);
		if (user && user.password === password) {
			//bcrypt.compare(user.password, hash)

			return { name: user.name, username: user.username, id: user.id };
		}
		return null;
	}
	async login(user: AccountLogin): Promise<Record<string, string>> {
		return {
			username: user.username,
			name: user.name,
			accessToken: this.jwtService.sign(user)
		};
	}

	async verifyAccessToken(payload: SignInGoogleDto): Promise<Record<string, string>> {
		const url = `https://oauth2.googleapis.com/tokeninfo?accessToken=${payload.accessToken}`;
		try {
			const { data } = await axios.get(url);
			if (data.email === payload.email && parseInt(data.expires_in) > 0) {
				const user = await this.accountService.getAccountByEmail(payload.email);
				if (user) {
					return {
						email: user.email,
						name: user.name,
						accessToken: this.jwtService.sign({
							name: user.name,
							email: user.email,
							id: user.id
						})
					};
				} else {
					const newUser = await this.accountService.createAccountGoogle(payload.name, payload.email);
					return {
						email: newUser.email,
						name: newUser.name,
						accessToken: this.jwtService.sign({
							name: newUser.name,
							email: newUser.email,
							id: newUser.id
						})
					};
				}
			}
		} catch (e) {
			console.log('> here');
			throw new UnauthorizedException();
		}
	}
}
