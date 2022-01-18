import { Column, Model, Table, DataType, ForeignKey, BelongsTo, HasMany, Index } from 'sequelize-typescript';

@Table
export class Admin extends Model {
  @Column({ type: DataType.STRING(16), unique: true, allowNull: false })
  username: string;

  @Index({ type: 'FULLTEXT', name: 'search_idx' })
  @Column({ type: DataType.STRING(50), unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  password: string;

  @Index({ type: 'FULLTEXT', name: 'search_idx' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  name: string;

  @ForeignKey(() => Admin)
  @Column
  creatorId: number;

  @BelongsTo(() => Admin)
  creator: Admin;

  @HasMany(() => Admin)
  createdList: Admin[];
}
