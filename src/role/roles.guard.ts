import { CanActivate, ExecutionContext, Injectable, mixin, Type } from '@nestjs/common';
import { Role } from './role.enum';
// import { Reflector } from '@nestjs/core';
// import { ROLES_KEY } from './roles.decorator';
// import * as jwt from 'jsonwebtoken';
// import { InjectModel } from '@nestjs/sequelize';
// import { ClassTeacher } from '../entities/class-teacher.entity';
// import { JwtPayload } from 'jsonwebtoken';
import { AuthGuard } from '@nestjs/passport';
import { ClassService } from 'src/class/class.service';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector, @InjectModel(ClassTeacher) private classAccountModel: typeof ClassTeacher) {}
//
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
//     if (!requiredRoles) {
//       return true;
//     }
//     const { headers, body } = context.switchToHttp().getRequest();
//     const token = headers.authorization.replace('Bearer ', '');
//     if (token) {
//       const payload = jwt.decode(token);
//       const { classId } = body;
//       const result = await this.classAccountModel.findOne({
//         where: {
//           classId,
//           accountId: (payload as JwtPayload).id
//         }
//       });
//       // return requiredRoles.some((role) => result.role?.includes(role));
//       return true;
//     }
//     return false;
//   }
// }

export const RolesGuard = (roles: Role[]): Type<CanActivate> => {
  @Injectable()
  class RoleGuardMixin extends AuthGuard('jwt') {
    constructor(private readonly classService: ClassService) {
      super();
    }
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest();
      const user = request.user;
      const classId = request.params.classId || request.body.classId;

      //Get role
      const role = await this.classService.GetRole(user.id, Number(classId));

      // Check role
      return roles.some((item) => item === role);
    }
  }
  return mixin(RoleGuardMixin);
};
