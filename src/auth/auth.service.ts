import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios, { AxiosResponse } from 'axios';
import * as bcrypt from 'bcrypt';

import { AccountService } from '../account/account.service';
import { AccountLogin } from './auth.interface';
import { SignInGoogleDto } from './auth.dto/sign-in.dto';
import { SignUpDto } from './auth.dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(private accountService: AccountService, private jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<AccountLogin | null> {
    const user = await this.accountService.findUser(username);
    if (!user.password) {
      return null;
    }
    const check = await bcrypt.compare(password, user.password);
    console.log(check);
    if (user && check) {
      return { name: user.name, username: user.username, id: user.id, studentId: user.studentId };
    }
    return null;
  }
  async login(user: AccountLogin): Promise<Record<string, string>> {
    return {
      username: user.username,
      name: user.name,
      accessToken: this.jwtService.sign(user)
    };
  }

  async verifyAccessToken(payload: SignInGoogleDto): Promise<Record<string, string>> {
    const url = `https://oauth2.googleapis.com/tokeninfo?accessToken=${payload.accessToken}`;
    try {
      const { data }: AxiosResponse = await axios.get(url);
      if (data.email === payload.email && parseInt(data.expires_in) > 0) {
        const user = await this.accountService.getAccountByEmail(payload.email);
        if (user) {
          return {
            email: user.email,
            name: user.name,
            accessToken: this.jwtService.sign({
              name: user.name,
              email: user.email,
              id: user.id,
              studentId: user.studentId
            })
          };
        } else {
          const newUser = await this.accountService.createAccountGoogle(payload.name, payload.email);
          return {
            email: newUser.email,
            name: newUser.name,
            accessToken: this.jwtService.sign({
              name: newUser.name,
              email: newUser.email,
              id: newUser.id
            })
          };
        }
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
  async registerUser(userInfo: SignUpDto): Promise<boolean> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(userInfo.password, saltOrRounds);

    try {
      await this.accountService.createAccount(userInfo.name, userInfo.email, hash, userInfo.username);
      return true;
    } catch (e) {
      return false;
    }
  }
}
