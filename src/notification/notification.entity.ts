import { Column, Model, Table, ForeignKey, DataType, BelongsTo } from 'sequelize-typescript';
import { Account } from 'src/account/account.entity';
import { Class } from 'src/class/class.entity';

@Table
export class Notification extends Model {
  @ForeignKey(() => Account)
  @Column({ allowNull: false })
  accountId: number;

  @BelongsTo(() => Account)
  account: Account;

  @Column({ allowNull: false, type: DataType.STRING(1000) })
  message: string;

  @Column({ allowNull: false, defaultValue: false })
  isRead: boolean;

  @ForeignKey(() => Class)
  @Column({ allowNull: false })
  classId: number;

  @BelongsTo(() => Class)
  class: Class;

  @Column({ allowNull: false, type: DataType.ENUM('Điểm', 'Phúc khảo') })
  topic: string;
}
