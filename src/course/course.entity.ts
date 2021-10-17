import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Course extends Model {
	@Column
	name: string;

	@Column
	dateBegin: Date;

	@Column({ defaultValue: true })
	isActive: boolean;
}
