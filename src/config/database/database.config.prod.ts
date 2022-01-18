import { registerAs } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Dialect } from 'sequelize/types';
import { readFileSync } from 'fs';

export default registerAs('sequelize.config', (): SequelizeModuleOptions => {
  const dialect = process.env.DB_DIALECT as Dialect;
  const dbCA = [readFileSync(process.env.DB_SSL_PATH, 'utf8')];
  return {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    dialect: dialect,
    dialectOptions: {
      ssl: {
        ca: dbCA
      }
    },
    define: {
      timestamps: true,
      paranoid: true
    },
    synchronize: true,
    autoLoadModels: true,
    logging: false
  };
});
