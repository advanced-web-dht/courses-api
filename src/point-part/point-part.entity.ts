import { Column, Model, Table, DataType, BelongsTo, ForeignKey, HasOne, BelongsToMany } from 'sequelize-typescript';
import { Class } from '../class/class.entity';
import { Assignment } from '../assignment/assignment.entity';
import { Point } from '../point/point.entity';
import { ClassStudent } from '../entities/class-student.entity';

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

  @HasOne(() => Assignment)
  assignment: Assignment;

  @BelongsToMany(() => ClassStudent, () => Point, 'pointPartId', 'csId')
  students: Array<ClassStudent & { detail: Point }>;
}
