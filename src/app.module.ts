import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import databaseConfigProd from './config/database/database.config.prod';
import databaseConfigDev from './config/database/database.config.dev';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EntityModule } from './entities/entity.module';
import { ClassModule } from './class/class.module';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { PointPartModule } from './point-part/point-part.module';
import { AssignmentModule } from './assignment/assignment.module';
import { PointModule } from './point/point.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [databaseConfigProd, databaseConfigDev] }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: process.env.NODE_ENV === 'development' ? databaseConfigDev : databaseConfigProd
    }),
    EntityModule,
    ClassModule,
    AccountModule,
    AuthModule,
    MailModule,
    PointPartModule,
    AssignmentModule,
    PointModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
