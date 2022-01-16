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
import { PointModule } from './point/point.module';
import { RoleModule } from './role/role.module';
import { ReviewModule } from './review/review.module';
import { NotificationModule } from './notification/notification.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [databaseConfigProd, databaseConfigDev] }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: process.env.NODE_ENV === 'development' ? databaseConfigDev : databaseConfigProd
    }),
    EventEmitterModule.forRoot(),
    EntityModule,
    ClassModule,
    AccountModule,
    AuthModule,
    MailModule,
    PointPartModule,
    PointModule,
    RoleModule,
    ReviewModule,
    NotificationModule,
    AdminModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
