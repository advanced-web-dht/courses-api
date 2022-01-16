import { Column, Model, Table, DataType, BelongsTo, ForeignKey, BelongsToMany, HasMany } from 'sequelize-typescript';
import { Class } from '../class/class.entity';
import { Point } from '../point/point.entity';
import { ClassStudent } from '../entities/class-student.entity';
import { Review } from '../review/review.entity';
import { Account } from '../account/account.entity';

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

  @Column({ allowNull: false, type: DataType.BOOLEAN, defaultValue: false })
  isDone: boolean;

  @BelongsToMany(() => ClassStudent, () => Point, 'pointPartId', 'csId')
  students: Array<ClassStudent & { detail: Point }>;

  @BelongsToMany(() => Account, () => Review)
  requesters: Array<Account & { detail: Review }>;

  @HasMany(() => Review)
  reviews: Review[];
}
