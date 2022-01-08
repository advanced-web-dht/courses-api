import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Class } from '../class/class.entity';
import { Account } from '../account/account.entity';

@Table
export class ClassStudent extends Model {
  @ForeignKey(() => Class)
  @Column({ unique: 'class_student_pk' })
  classId: number;

  @Column({ primaryKey: true, unique: 'class_student_pk', type: DataType.STRING(15) })
  studentId: string;

  @ForeignKey(() => Account)
  accountId: number;

  @Column({ type: DataType.STRING(50) })
  name: string;

  @BelongsTo(() => Account)
  account: Account;

  @BelongsTo(() => Class)
  class: Class;
}
