import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Account } from './account.entity';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';

@Module({
	imports: [SequelizeModule.forFeature([Account])],
	controllers: [AccountController],
	providers: [AccountService],
	exports: [AccountService]
})
export class AccountModule {}
