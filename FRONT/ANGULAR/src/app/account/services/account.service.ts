import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, firstValueFrom, Observable, of, throwError } from 'rxjs';
import { Account } from '../models/account.model';
import { UserService } from '../../services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private accountUrl = 'http://localhost:3000/accounts'
  private headers: HttpHeaders;

  constructor(private userService: UserService, private http: HttpClient) {
    this.headers = new HttpHeaders({ 'Authorization': `Bearer ${this.userService.getToken()}` })
  }

  getAccounts(): Observable<Account[]> {
    return this.fetchAccountsByUser()
  }

  private fetchAccountsByUser() : Observable<Account[]> {
    const id = this.userService.getUserId()
    return this.http.get<Account[]>(`${this.accountUrl}/user/${id}`, { headers: this.headers }).pipe(
      catchError((_) => {return []})
    );
  }

  getAccountById(id: string): Observable<Account> {
    try {
      const res = this.fetchDetailAccounts(id)
      return res;
    } catch (error) {
      return throwError(() => new Error('Failed to fetch account by ID.'))
    }
  }

  private fetchDetailAccounts(accountId: string): Observable<Account> {
    return this.http.get<Account>(`${this.accountUrl}/${accountId}`, { headers: this.headers }).pipe(
      catchError(() => {
        return throwError(() => new Error('Failed to fetch account details.'))
      })
    );
  }

  addAccount(accountType: string, balance: string): Observable<Account> {
    try {
      const res = this.fetchCreateAccont(accountType, balance)
      return res
    } catch (error) {
      return throwError(() => new Error('Failed in create account.'))
    }
  }

  private fetchCreateAccont(accountType: string, balance: string): Observable<Account> {
    return this.http.post<Account>(
      `${this.accountUrl}`,
      { balance, type: accountType, userId: this.userService.getUserId() },
      { headers: this.headers }).pipe(
      catchError(() => {
        return throwError(() => new Error('Create account failed.'))
      })
    )
  }
}
