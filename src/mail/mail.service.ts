import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { google } from 'googleapis';
import { createTransport } from 'nodemailer';

const UPDATE_INTERVAL = 3900 * 1000;

@Injectable()
export class MailService {
	private transport;
	constructor() {
		(async () => {
			await this.updateTransport();
		})();
	}

	@Interval(UPDATE_INTERVAL)
	async updateTransport(): Promise<void> {
		const oAuth2Client = new google.auth.OAuth2(
			process.env.GG_CLIENT_ID,
			process.env.GG_CLIENT_SECRET,
			process.env.GG_REDIRECT
		);
		oAuth2Client.setCredentials({ refresh_token: process.env.GG_REFRESH_TOKEN });
		const accessToken = await oAuth2Client.getAccessToken();
		this.transport = createTransport(
			{
				service: 'gmail',
				secure: false,
				auth: {
					type: 'OAuth2',
					user: process.env.GG_EMAIL,
					clientId: process.env.GG_CLIENT_ID,
					clientSecret: process.env.GG_CLIENT_SECRET,
					accessToken: accessToken.token
				}
			},
			{
				from: '"No Reply" <noreply@example.com>'
			}
		);
	}

	async sendInvitationMail(email: string, url: string) {
		await this.transport.sendMail({
			to: email,
			from: '"No Reply" <noreply@fitclass.com>',
			subject: 'Welcome to Fit Class! Lời mời tham gia lớp học',
			html: `<p>Xin chào,</p>
				<p>Nhấn vào nút tham gia để ghi danh vào lớp</p>
				<p>
				<a href=${url}>Tham gia</a> 
				</p>
				<p>Chúc bạn một ngày vui vẻ!!</p>`
		});
	}
}
