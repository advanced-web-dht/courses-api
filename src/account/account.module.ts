import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Account } from './account.entity';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { ClassAccount } from '../entities/class-account.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([Account]), SequelizeModule.forFeature([ClassAccount]), forwardRef(() => AuthModule)],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService]
})
export class AccountModule {}
