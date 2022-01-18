import { Column, Model, Table, DataType, BelongsToMany, HasMany, Index } from 'sequelize-typescript';

import { Class } from '../class/class.entity';
import { ClassTeacher } from '../entities/class-teacher.entity';
import { ClassStudent } from '../entities/class-student.entity';
import { PointPart } from '../point-part/point-part.entity';
import { Review } from '../review/review.entity';
import { Notification } from 'src/notification/notification.entity';

@Table
export class Account extends Model {
  @Column({ type: DataType.STRING(16), unique: true })
  username: string;

  @Index({ type: 'FULLTEXT', name: 'search_idx' })
  @Column({ type: DataType.STRING(50), unique: true })
  email: string;

  @Column({ type: DataType.STRING(255) })
  password: string;

  @Index({ type: 'FULLTEXT', name: 'search_idx' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  name: string;

  @Column({ type: DataType.STRING(15) })
  studentId: string;

  @Column({ type: DataType.ENUM('active', 'inactive', 'blocked', 'deleted'), defaultValue: 'inactive' })
  status: string;

  @BelongsToMany(() => Class, () => ClassTeacher, 'accountId')
  tClasses: Array<Class & { ClassAccount: ClassTeacher }>;

  @HasMany(() => ClassStudent)
  sClasses: Array<ClassStudent>;

  @HasMany(() => Class, 'ownerId')
  oClasses: Array<Class>;

  @BelongsToMany(() => PointPart, () => Review, 'accountId')
  requestedReviews: Array<PointPart & { detail: Review }>;

  @HasMany(() => Notification)
  notifications: Array<Notification>;
}
