import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Account } from '../models/account.model';
import { AccountService } from '../services/account.service';
import { MatCardModule } from '@angular/material/card';
import { MatDivider, MatList, MatListItem } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.css'],
  imports: [
    CommonModule,
    MatCardModule,
    MatList,
    MatListItem,
    MatDivider,
    MatIcon
  ]
})
export class AccountDetailComponent implements OnInit {
  account$: Observable<Account | undefined>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) {
    this.account$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return this.accountService.getAccountById(id || '');
      })
    );
  }

  ngOnInit(): void {
  }

  goBack(): void {
    this.router.navigate(['/account']);
  }

  getAccountTypeLabel(type: 'savings' | 'checking'): string {
    return type === 'savings' ? 'Ahorros' : 'Corriente';
  }
}
