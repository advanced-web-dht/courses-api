import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';
import { FastifyRequest } from 'fastify';
import * as jwt from 'jsonwebtoken';
import { InjectModel } from '@nestjs/sequelize';
import { ClassAccount } from '../entities/class-account.entity';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		@InjectModel(ClassAccount) private classAccountModel: typeof ClassAccount
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass()
		]);
		if (!requiredRoles) {
			return true;
		}
		const { headers, body } = context.switchToHttp().getRequest();
		const token = headers.authorization.replace('Bearer ', '');
		if (token) {
			const payload = jwt.decode(token);
			const { classId } = body;
			const result = await this.classAccountModel.findOne({
				where: {
					classId,
					accountId: (payload as JwtPayload).id
				}
			});
			return requiredRoles.some((role) => result.role?.includes(role));
		}
		return false;
	}
}
