import { Column, Model, Table, ForeignKey, DataType, BelongsTo } from 'sequelize-typescript';
import { Account } from '../account/account.entity';
import { Review } from '../review/review.entity';

export type Role = 'student' | 'teacher' | 'owner';

@Table
export class Comment extends Model {
  @ForeignKey(() => Review)
  @Column
  reviewId: number;

  @ForeignKey(() => Account)
  @Column
  accountId: number;

  @Column({ type: DataType.STRING(1000), allowNull: false })
  message: string;

  @Column({ type: DataType.ENUM('student', 'teacher'), allowNull: false })
  sourceType: string;

  @BelongsTo(() => Review)
  review: Review;

  @BelongsTo(() => Account)
  sender: Account;
}
