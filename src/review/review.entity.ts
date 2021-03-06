import { Column, Model, Table, ForeignKey, DataType, PrimaryKey, HasMany, BelongsTo } from 'sequelize-typescript';
import { PointPart } from '../point-part/point-part.entity';
import { Account } from '../account/account.entity';
import { Comment } from '../entities/comment.entity';

@Table
export class Review extends Model {
  @PrimaryKey
  @Column({ allowNull: false, autoIncrement: true })
  id: number;

  @ForeignKey(() => Account)
  @Column({ allowNull: false })
  accountId: number;

  @ForeignKey(() => PointPart)
  @Column({ allowNull: false })
  pointPartId: number;

  @Column({ type: DataType.STRING(10000) })
  content: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  prePoint: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  expectedPoint: number;

  @Column({ type: DataType.FLOAT })
  finalPoint: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isDone: boolean;

  @HasMany(() => Comment)
  comments: Comment[];

  @BelongsTo(() => PointPart)
  grade: PointPart;

  @BelongsTo(() => Account)
  requester: Account;
}
