import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Account } from './Account';

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Account)
    accountOrigin: Account;

    @ManyToOne(() => Account)
    accountDestination: Account;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    amount: number;

    @Column()
    concept: string;

    @Column()
    type: string; // ingreso | gasto

    @Column({ default: () => 'NOW()' })
    created_at: Date;
}
