import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
	constructor(private mailerService: MailerService) {}

	async sendInvitationMail(email: string, url: string) {
		await this.mailerService.sendMail({
			to: email,
			from: '"No Reply" <noreply@example.com>',
			subject: 'Welcome to Nice App! Confirm your Email',
			template: './information',
			context: {
				url
			}
		});
	}
}
