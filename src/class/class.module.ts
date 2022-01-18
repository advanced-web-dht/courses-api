import { Module, Global } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Class } from './class.entity';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { AccountModule } from '../account/account.module';
import { ClassTeacher } from '../entities/class-teacher.entity';
import { ClassStudent } from '../entities/class-student.entity';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([Class, ClassTeacher, ClassStudent]), AuthModule, MailModule, AccountModule],
  controllers: [ClassController],
  providers: [ClassService],
  exports: [ClassService]
})
export class ClassModule {}
