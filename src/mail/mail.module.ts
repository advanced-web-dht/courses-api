import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';

@Module({
	imports: [
		MailerModule.forRoot({
			transport: {
				service: 'Gmail',
				secure: false,
				auth: {
					type: 'OAuth2',
					user: 'lehuyforweb@gmail.com',
					clientId: '633473437200-g1rbi6qvu4bvabg3gqfa258r2tut3e6d.apps.googleusercontent.com',
					clientSecret: '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',
					refreshToken:
						'1//04025lQrGnjb-CgYIARAAGAQSNwF-L9IrEO1pF6xwD5geZ8wqTMXxvTtYoV79ZAFpuK_I8DMO5L0CcI3sdmTVSVLqSVfNKSemh8w',
					accessToken:
						'ya29.a0ARrdaM-D837U-Gz5YMbTgQXY61Sx5WCYoYLLOPDWKd_eIR8i2SfBAfJmeFIPp1IRGpmDu3qOmvBb2-LMG64toPOlKFjP_mRZkWHwz-sYuAj_Ni-xbYfl6MvA22H3m45ZCzVXi6dozzeSbAfEtLqIggij5WE0'
				}
			},
			defaults: {
				from: '"No Reply" <noreply@example.com>'
			},
			template: {
				dir: join(__dirname, 'templates'),
				adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
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
