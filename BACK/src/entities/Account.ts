import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User';
import { Transaction } from './Transaction';

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ unique: true })
    accountNumber: string;

    @Column()
    type: string;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    balance: number;

    @ManyToOne(() => User, user => user.accounts)
    user: User;

    @OneToMany(() => Transaction, tx => tx.accountOrigin)
    transactions: Transaction[];
}
