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
}
