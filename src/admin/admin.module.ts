import { forwardRef, Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AdminService } from './admin.service';
import { Admin } from './admin.entity';
import { AdminController } from './admin.controller';
import { AuthModule } from '../auth/auth.module';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([Admin]), forwardRef(() => AuthModule)],
  providers: [AdminService],
  exports: [AdminService],
  controllers: [AdminController]
})
export class AdminModule {}
