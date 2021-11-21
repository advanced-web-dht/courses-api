import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mail.service';
import { join } from 'path';

@Module({
	imports: [
		ConfigModule.forRoot(),
		MailerModule.forRoot({
			transport: {
				service: 'Gmail',
				secure: false,
				auth: {
					type: 'OAuth2',
					user: process.env.GG_EMAIL,
					clientId: process.env.GG_CLIENT_ID,
					clientSecret: process.env.GG_CLIENT_SECRET,
					refreshToken: process.env.GG_REFRESH_TOKEN,
					accessToken: process.env.GG_ACCESS_TOKEN
				}
			},
			defaults: {
				from: '"No Reply" <noreply@example.com>'
			},
			template: {
				dir: join(__dirname, 'templates'),
				adapter: new HandlebarsAdapter(),
				options: {
					strict: true
				}
			}
		})
	],
	providers: [MailService],
	exports: [MailService]
})
export class MailModule {}
