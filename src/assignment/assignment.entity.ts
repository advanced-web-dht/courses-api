import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { PointPart } from '../point-part/point-part.entity';

@Table
export class Assignment extends Model {
	@ForeignKey(() => PointPart)
	@Column({ allowNull: false })
	pointPartId: number;

	@BelongsTo(() => PointPart)
	pointPart: PointPart;

	@Column({ type: DataType.STRING(255), allowNull: false })
	name: string;

	@Column({ type: DataType.DATE, allowNull: false })
	dateEnded: Date;
}
