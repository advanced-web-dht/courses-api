import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Account } from './account.entity';

@Injectable()
export class AccountService {
	constructor(
		@InjectModel(Account)
		private accountModel: typeof Account
	) {}

	async findUser(username: string): Promise<Account> {
		const account = await this.accountModel.findOne({ where: { username: username } });
		return account;
	}

	async getAccountByEmail(email: string): Promise<Account> {
		const account = await this.accountModel.findOne({ where: { email: email } });
		return account;
	}

	async createAccountGoogle(name: string, email: string): Promise<Account> {
		const info = {
			name,
			email
		};
		const newAccount = await this.accountModel.create(info);
		return newAccount;
	}
	async createAccount(name: string, email: string, password: string, username: string): Promise<Account> {
		const info = {
			name,
			email,
			password,
			username
		};
		const newAccount = await this.accountModel.create(info);
		return newAccount;
	}
}
