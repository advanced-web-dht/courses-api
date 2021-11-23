import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { nanoid } from 'nanoid';
import { Op } from 'sequelize';

import { Class } from './class.entity';
import { ClassAccount, Role } from '../entities/class-account.entity';
import { Account } from '../account/account.entity';
import { createClassDto } from './class.dto/create-class.dto';

@Injectable()
export class ClassService {
	constructor(
		@InjectModel(Class)
		private classModel: typeof Class,
		@InjectModel(ClassAccount)
		private classAccountModel: typeof ClassAccount
	) {}

	async CreateClass({ name }: createClassDto): Promise<Class> {
		const code = nanoid(8);
		const classToAdd = {
			name,
			code
		};
		try {
			const newClass = await this.classModel.create(classToAdd);
			return newClass;
		} finally {
			// do nothing
		}
	}

	async getAll(userId: number): Promise<Class[]> {
		return await this.classModel.findAll({
			include: [
				{
					model: Account,
					where: {
						id: userId
					}
				}
			]
		});
	}

	async AddMember(AccountId: number, ClassId: number, role: Role): Promise<void> {
		const classToAdd = {
			accountId: AccountId,
			classId: ClassId,
			role: role
		};
		console.log(classToAdd);
		await this.classAccountModel.create(classToAdd);
	}

	async getClassByCode(code: string, accountId: number): Promise<Class> {
		try {
			const result = await this.classModel.findOne({
				include: [
					{
						model: Account,
						through: {
							as: 'details',
							attributes: ['role', 'accountId']
						},
						attributes: ['name', 'id']
					}
				],
				where: {
					code: code
				}
			});
			//Check is member
			const member = result.members.find((member) => member.details.accountId === accountId);
			if (member) {
				const owner = result.members.find(
					(member) => member.id === accountId && member.details.role === 'owner'
				);
				result.setDataValue('isOwner', !!owner);
				return result;
			}
			return null;
		} catch (err) {
			return null;
		}
	}

	async getClassByCodeToEnroll(code: string): Promise<Class> {
		try {
			const result = await this.classModel.findOne({
				where: {
					code: code
				},
				include: [
					{
						model: Account,
						through: {
							where: {
								role: 'owner'
							},
							attributes: []
						},
						attributes: ['name']
					}
				]
			});

			return result;
		} catch (err) {
			return null;
		}
	}

	async getMemberByRole(id: number, role: string): Promise<Account[]> {
		const result = await this.classModel.findOne({
			where: {
				id: id
			},
			include: [
				{
					model: Account,
					attributes: ['id', 'name'],
					through: {
						where: {
							role: role
						},
						attributes: []
					}
				}
			]
		});
		return result.members;
	}
}
