import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Account } from './account.entity';

@Injectable()
export class AccountService {
	constructor(
		@InjectModel(Account)
		private classModel: typeof Account
	) {}
}
