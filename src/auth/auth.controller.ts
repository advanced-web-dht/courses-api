import { Controller, Get, Post, Request, UseGuards, Body, Res } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AccountService } from '../account/account.service';
import { AccountLogin } from './auth.interface';
import { SignInGoogleDto } from './auth.dto/sign-in.dto';
import { SignUpDto } from './auth.dto/sign-up.dto';

declare module 'fastify' {
  interface FastifyRequest {
    user: AccountLogin;
  }
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private accountService: AccountService) {}

  @Post('/register')
  async register(@Body() body: SignUpDto, @Res() res: FastifyReply): Promise<void> {
    try {
      const result = await this.authService.registerUser(body);
      if (result) {
        res.status(201).send({ isSuccess: result });
      } else {
        res.status(400).send({ isSuccess: result });
      }
    } catch (err) {
      res.status(500).send({ isSuccess: false });
    }
  }
  @Post('/signin/google')
  async loginGoogle(@Body() payload: SignInGoogleDto): Promise<Record<string, string>> {
    return this.authService.verifyAccessToken(payload);
  }

  @UseGuards(AuthGuard('local'))
  @Post('/signin')
  async login(@Request() req: FastifyRequest): Promise<Record<string, string>> {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  async getProfile(@Request() req: FastifyRequest): Promise<unknown> {
    const user = await this.accountService.findUser(req.user.email);
    const { password, ...result } = user;
    return result;
  }
}
