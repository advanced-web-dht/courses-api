import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table
export class Class extends Model {
	@Column({ type: DataType.STRING(255) })
	name: string;

	@Column({ type: DataType.STRING(8) })
	code: string;

	@Column({ defaultValue: true })
	isActive: boolean;

	@Column({ defaultValue: false })
	isArchived: boolean;
}
