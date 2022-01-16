import { Role } from '../role/role.enum';
import { CanActivate, ExecutionContext, Injectable, mixin, Type } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';

export const AdminGuard = (roles: Role[]): Type<CanActivate> => {
  @Injectable()
  class RoleGuardMixin extends AuthGuard('jwt') {
    constructor(private readonly adminService: AdminService) {
      super();
    }
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      // const request = context.switchToHttp().getRequest();
      // const user = request.user;
      // const classId = request.params.classId || request.body.classId;
      // //Get role
      // const role = await this.classService.GetRole(user.id, Number(classId));
      //
      // // Check role
      // return roles.some((item) => item === role);
      return true;
    }
  }
  return mixin(RoleGuardMixin);
};
