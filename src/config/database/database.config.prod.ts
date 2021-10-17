import { registerAs } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Dialect } from 'sequelize/types';
import { readFileSync } from 'fs';

const dbCA = [readFileSync('/Users/ntduyfit/Documents/A_Web/courses/courses-api/db-ssl.pem', 'utf8')];

export default registerAs('sequelize.config', (): SequelizeModuleOptions => {
	const dialect = process.env.DB_DIALECT as Dialect;
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
			timestamps: true
		},
		synchronize: true,
		autoLoadModels: true,
		logging: false
	};
});
