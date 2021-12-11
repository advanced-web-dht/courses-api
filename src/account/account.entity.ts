import { Column, Model, Table, DataType, BelongsToMany } from 'sequelize-typescript';

import { Class } from '../class/class.entity';
import { ClassAccount } from '../entities/class-account.entity';

@Table
export class Account extends Model {
  @Column({ type: DataType.STRING(16), unique: true })
  username: string;

  @Column({ type: DataType.STRING(50), unique: true })
  email: string;

  @Column({ type: DataType.STRING(255) })
  password: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  name: string;

  @Column({ type: DataType.STRING(15) })
  studentId: string;

  @Column({ type: DataType.ENUM('active', 'inactive', 'blocked', 'deleted'), defaultValue: 'active' })
  status: string;

  @BelongsToMany(() => Class, () => ClassAccount)
  classes: Array<Class & { ClassAccount: ClassAccount }>;
}
