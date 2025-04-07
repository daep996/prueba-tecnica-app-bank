import { MatDivider, MatList, MatListItem } from '@angular/material/list';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { TransactionsAccountComponent } from '../../transaction/transactions-account/transactions-account.component';
import { AccountService } from '../services/account.service';
import { Account } from '../models/account.model';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.css'],
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIcon,
    MatList,
    MatListItem,
    MatDivider,
    MatListItem,
    CommonModule,
    TransactionsAccountComponent
  ]
})
export class AccountDetailComponent {
  account$: Observable<Account | undefined>;
  idAccount: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) {
    this.account$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id')
        this.idAccount = params.get('id') ?? ''
        return this.accountService.getAccountById(id || '')
      })
    ).pipe(
      catchError(() => {
        this.router.navigate(['/login'])
        return throwError(() => new Error('Error fetching account detail of user.'))
      })
    )
  }

  goBack(): void {
    this.router.navigate(['/account']);
  }

}
