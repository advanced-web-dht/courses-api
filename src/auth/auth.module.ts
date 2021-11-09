import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountModule } from '../account/account.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';

@Module({
	imports: [
		ConfigModule.forRoot(),
		AccountModule,
		PassportModule,
		JwtModule.register({
			secret: process.env.SECRET_KEY,
			signOptions: { expiresIn: '60s' }
		})
	],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy],
	exports: [AuthService]
})
export class AuthModule {}
