import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Account } from '../models/account.model';
import { AccountService } from '../services/account.service';
import { AddAccountDialogComponent } from '../add-account-dialog/add-account-dialog.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
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
export class AccountListComponent implements OnInit {
  accounts$: Observable<Account[]>;
  displayedColumns: string[] = ['name', 'accountNumber', 'accountType', 'balance', 'actions'];

  constructor(
    private accountService: AccountService,
    private dialog: MatDialog,
    private userService: UserService,
    private router: Router
  ) {
    this.accounts$ = this.accountService.getAccounts();
  }

  ngOnInit(): void {
    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/login'])
    }
  }

  openAddAccountDialog(): void {
    const dialogRef = this.dialog.open(AddAccountDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.accountService.addAccount(result);
      }
    });
  }

}
