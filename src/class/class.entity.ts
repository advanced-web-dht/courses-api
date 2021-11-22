import { Column, Model, Table, DataType, BelongsToMany } from 'sequelize-typescript';
import { Account } from '../account/account.entity';
import { ClassAccount } from '../entities/class-account.entity';

@Table
export class Class extends Model {
	@Column({ type: DataType.STRING(255) })
	name: string;

	@Column({ type: DataType.STRING(8), unique: true })
	code: string;

	@Column({ defaultValue: false })
	isDeleted: boolean;

	@Column({ defaultValue: false })
	isArchived: boolean;

	@Column({ type: DataType.ENUM('public', 'private'), defaultValue: 'public' })
	visibility: string;

	@BelongsToMany(() => Account, () => ClassAccount)
	members: Array<Account & { ClassAccount: ClassAccount }>;
}
