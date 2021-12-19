import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Class } from './class.entity';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { AuthModule } from '../auth/auth.module';
import { ClassAccount } from '../entities/class-account.entity';
import { MailModule } from '../mail/mail.module';
import { Account } from '../account/account.entity';

@Module({
	imports: [SequelizeModule.forFeature([Class, ClassAccount, Account]), AuthModule, MailModule],
	controllers: [ClassController],
	providers: [ClassService]
})
export class ClassModule {}
