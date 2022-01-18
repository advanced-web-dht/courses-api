import { Column, Model, Table, DataType, BelongsToMany, HasMany, BelongsTo, ForeignKey, Index } from 'sequelize-typescript';
import { Account } from '../account/account.entity';
import { ClassTeacher } from '../entities/class-teacher.entity';
import { PointPart } from '../point-part/point-part.entity';
import { ClassStudent } from '../entities/class-student.entity';

@Table
export class Class extends Model {
  @Index({ type: 'FULLTEXT', name: 'search_idx' })
  @Column({ type: DataType.STRING(255) })
  name: string;

  @Column({ type: DataType.STRING(8), unique: true })
  code: string;

  @Column({ defaultValue: false })
  isDeleted: boolean;

  @Column({ defaultValue: false })
  isArchived: boolean;

  @Column({ type: DataType.ENUM('public', 'private'), defaultValue: 'public' })
  visibility: string;

  @BelongsToMany(() => Account, () => ClassTeacher)
  teachers: Array<Account & { detail: ClassTeacher }>;

  @HasMany(() => ClassStudent)
  students: Array<ClassStudent>;

  @HasMany(() => PointPart)
  grades: PointPart[];

  @ForeignKey(() => Account)
  @Column
  ownerId: number;

  @BelongsTo(() => Account, 'ownerId')
  owner: Account;

  role: string;
}
