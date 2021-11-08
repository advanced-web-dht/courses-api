import { Controller } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('accounts')
export class AccountController {
	constructor(private readonly classService: AccountService) {}
}
