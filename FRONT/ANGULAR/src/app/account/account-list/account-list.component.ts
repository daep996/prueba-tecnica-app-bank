import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { Account } from '../models/account.model';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { AddAccountDialogComponent } from '../add-account-dialog/add-account-dialog.component';
import { AccountService } from '../services/account.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css'],
  imports: [
    CommonModule,
    RouterLink,
    MatIcon,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardTitle,
    MatCardContent,
    MatCardActions
  ]
})
export class AccountListComponent implements OnInit, OnDestroy {
  protected accounts$: Subject<Account[]>
  displayedColumns: string[] = ['name', 'accountNumber', 'accountType', 'balance', 'actions'];

  constructor(
    private accountService: AccountService,
    private dialog: MatDialog,
    private userService: UserService,
    private router: Router
  ) {
    this.accounts$ = new Subject<Account[]>();
  }

  ngOnInit(): void {
    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/login'])
    }
    this.accountService.getAccounts()
      .pipe(takeUntil(this.accounts$))
      .subscribe({
        next: (accounts) => {
          this.accounts$.next(accounts);
        },
        error: (error) => {
          this.router.navigate(['/login'])
        }
      })
  }

  ngOnDestroy(): void {
      this.accounts$.next([])
      this.accounts$.complete()
  }

  openAddAccountDialog(): void {
    const dialogRef = this.dialog.open(AddAccountDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(_ => {
      this.accountService.getAccounts().subscribe((accounts) => this.accounts$.next(accounts))
    });
  }

  openTransferComponent() :void {
    this.router.navigate(['/transaction/new'])
  }

}
