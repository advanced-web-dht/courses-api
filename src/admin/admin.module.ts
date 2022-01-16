import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AdminService } from './admin.service';
import { Admin } from './admin.entity';
import { AdminController } from './admin.controller';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([Admin])],
  providers: [AdminService],
  exports: [AdminService],
  controllers: [AdminController]
})
export class AdminModule {}
