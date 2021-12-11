import { Column, Model, Table, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Class } from '../class/class.entity';
import { Account } from '../account/account.entity';
import { PointPart } from '../point-part/point-part.entity';

@Table
export class Point extends Model {
	@ForeignKey(() => Class)
	@Column({ allowNull: false })
	classId: number;

	@BelongsTo(() => Class)
	class: Class;

	@ForeignKey(() => Account)
	@Column({ allowNull: false })
	accountId: number;

	@BelongsTo(() => Account)
	student: Account;

	@ForeignKey(() => PointPart)
	@Column({ allowNull: false })
	pointPartId: number;

	@BelongsTo(() => PointPart)
	pointPart: PointPart;

	@Column({ allowNull: false })
	point: number;
}
