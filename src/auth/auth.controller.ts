import { Controller, Get, Post, Request, UseGuards, Body, Res } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';

import { AuthService } from './auth.service';
import { AccountService } from '../account/account.service';
import { AccountLogin } from './auth.interface';
import { SignInGoogleDto } from './auth.dto/sign-in.dto';
import { SignUpDto } from './auth.dto/sign-up.dto';
import { MailService } from '../mail/mail.service';

declare module 'fastify' {
  interface FastifyRequest {
    user: AccountLogin;
  }
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private accountService: AccountService, private readonly mailService: MailService) {}

  @Post('/register')
  async register(@Body() body: SignUpDto, @Res() res: FastifyReply): Promise<void> {
    try {
      const result = await this.authService.registerUser(body);
      if (result) {
        const token = jwt.sign({ email: body.email }, process.env.SECRET_KEY, { expiresIn: '10m' });
        const url = `${process.env.CLIENT_URL}/verify?token=${token}`;
        this.mailService.sendAccountVerifyEmail(body.email, url);
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
  async login(@Request() req: FastifyRequest, @Res() res: FastifyReply): Promise<void> {
    console.log(req.user);
    if (req.user.status !== 'active') {
      res.status(403).send({ isSuccess: false });
    } else {
      const result = await this.authService.login(req.user);
      res.status(200).send(result);
    }
  }

  @Post('/request-activate')
  async RequestActivateAccount(@Res() res: FastifyReply, @Body('email') email: string): Promise<void> {
    const token = jwt.sign({ email: email }, process.env.SECRET_KEY, { expiresIn: '10m' });
    const url = `${process.env.CLIENT_URL}/verify?token=${token}`;
    this.mailService.SendReactivateEmail(email, url);
    res.status(200).send({ isSuccess: true });
  }

  @Post('/verify')
  async VerifyAccount(@Res() res: FastifyReply, @Body('token') token: string): Promise<void> {
    try {
      const check = jwt.verify(token, process.env.SECRET_KEY);
      if (check) {
        const result = await this.authService.VerifyAccount((check as jwt.JwtPayload).email);
        if (result) {
          return res.status(200).send({ isSuccess: true });
        }
      }
      return res.status(400).send({ isSuccess: false });
    } catch {
      res.status(500).send({ isSuccess: false });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  async getProfile(@Request() req: FastifyRequest): Promise<unknown> {
    const user = await this.accountService.findUser(req.user.email);
    const { password, ...result } = user;
    return result;
  }

  @Post('/forgot-password')
  async ForgotPassword(@Res() res: FastifyReply, @Body('email') email: string): Promise<void> {
    try {
      const check = this.accountService.checkEmailExisted(email);
      if (check) {
        const token = jwt.sign({ email: email }, process.env.SECRET_KEY, { expiresIn: '10m' });
        const url = `${process.env.CLIENT_URL}/forgot-password?token=${token}`;
        this.mailService.SendResetPasswordEmail(email, url);
        res.status(200).send({ isSuccess: true });
      }
      return res.status(400).send({ isSuccess: false });
    } catch {
      res.status(500).send({ isSuccess: false });
    }
  }
  @Post('/reset-password')
  async ResetPassword(@Res() res: FastifyReply, @Body('token') token: string, @Body('password') password: string): Promise<void> {
    try {
      const check = jwt.verify(token, process.env.SECRET_KEY);
      if (check) {
        const result = await this.authService.ResetPassword((check as jwt.JwtPayload).email, password);
        if (result) {
          return res.status(200).send({ isSuccess: true });
        }
      }
      return res.status(400).send({ isSuccess: false });
    } catch {
      res.status(500).send({ isSuccess: false });
    }
  }
}
