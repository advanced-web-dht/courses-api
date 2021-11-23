import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { MailService } from './mail.service';

@Module({
	imports: [ConfigModule.forRoot(), ScheduleModule.forRoot()],
	providers: [MailService],
	exports: [MailService]
})
export class MailModule {}
