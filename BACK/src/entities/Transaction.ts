import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Account } from './Account';
import { User } from './User';

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    amount: number;
    
    @Column()
    concept: string;
    
    @Column()
    type: string; // ingreso | gasto
    
    @Column({ default: () => 'NOW()' })
    created_at: Date;

    @ManyToOne(() => Account)
    accountOrigin: Account;
    
    @ManyToOne(() => Account)
    accountDestination: Account;

    @ManyToOne(() => User)
    user: User;
}
