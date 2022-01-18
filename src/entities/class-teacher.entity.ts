import { Column, Model, Table, ForeignKey } from 'sequelize-typescript';
import { Class } from '../class/class.entity';
import { Account } from '../account/account.entity';

export type Role = 'student' | 'teacher' | 'owner';

@Table
export class ClassTeacher extends Model {
  @ForeignKey(() => Class)
  @Column({ primaryKey: true })
  classId: number;

  @ForeignKey(() => Account)
  @Column({ primaryKey: true })
  accountId: number;
}
