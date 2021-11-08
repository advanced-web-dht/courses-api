import { Column, Model, Table, DataType, ForeignKey } from 'sequelize-typescript';
import { Class } from '../class/class.entity';
import { Account } from '../account/account.entity';

@Table
export class ClassAccount extends Model {
	@ForeignKey(() => Class)
	@Column({ primaryKey: true })
	classId: number;

	@ForeignKey(() => Account)
	@Column({ primaryKey: true })
	accountId: number;

	@Column({ type: DataType.ENUM('student', 'teacher') })
	role: string;
}
