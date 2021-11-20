import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountModule } from '../account/account.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { MailService } from '../mail/mail.service';

@Module({
	imports: [
		ConfigModule.forRoot(),
		forwardRef(() => AccountModule),
		PassportModule,
		JwtModule.register({
			secret: process.env.SECRET_KEY,
			signOptions: { expiresIn: '12h' }
		}),
		MailService
	],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy, JwtStrategy, MailService],
	exports: [AuthService]
})
export class AuthModule {}
