import { Column, Model, Table, DataType, BelongsTo, ForeignKey, HasMany, HasOne } from 'sequelize-typescript';
import { Class } from '../class/class.entity';
import { Assignment } from '../assignment/assignment.entity';
import { Point } from '../point/point.entity';

@Table
export class PointPart extends Model {
	@Column({ primaryKey: true, autoIncrement: true, unique: 'pointPart_pk' })
	id: number;

	@ForeignKey(() => Class)
	@Column({ allowNull: false, unique: 'pointPart_pk' })
	classId: number;

	@BelongsTo(() => Class)
	class: Class;

	@Column({ type: DataType.STRING(50), allowNull: false })
	name: string;

	@Column({ allowNull: false })
	ratio: number;

	@Column({ allowNull: true })
	order: number;

	@HasOne(() => Assignment)
	assignment: Assignment;

	@HasMany(() => Point)
	points: Point[];
}
