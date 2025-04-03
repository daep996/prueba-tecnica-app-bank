import { Component, Input, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { TransactionService } from '../transaction.service';
import { UserService } from '../../services/user.service';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

interface TransactionDetail {
  id: number;
  concept: string;
  amount: number;
  created_at: Date | string;
  type: string;
}

@Component({
  selector: 'app-transactions-account',
  imports: [
    MatTableModule,
    MatCardContent,
    MatInputModule,
    MatCard,
  ],
  templateUrl: './transactions-account.component.html',
  styleUrl: './transactions-account.component.css'
})
export class TransactionsAccountComponent implements OnInit {
  @Input()
  id!: string;
  displayedColumns: string[] = ['concept', 'amount', 'created_at', 'type']
  dataSource: TransactionDetail[] = []

  constructor(private txService: TransactionService, private userService: UserService) { }

  ngOnInit(): void {
      this.txService.getTransacionByAccount(Number(this.id)).subscribe((transactions: TransactionDetail[]) => {
        this.dataSource = transactions
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource = this.dataSource.filter(transaction =>
      transaction.concept.toLowerCase().includes(filterValue.trim().toLowerCase())
    )
  }

}
