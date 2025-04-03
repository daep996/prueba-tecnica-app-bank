import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service';
import { catchError, Observable, throwError } from 'rxjs';

interface TransactionPost {
    accountOriginId: string;
    accountDestinationId: string;
    amount: number;
    concept: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactionUrl = 'http://localhost:3000/transactions'
  private headers: HttpHeaders;

  constructor(private userService: UserService, private http: HttpClient) {
    this.headers = new HttpHeaders({ 'Authorization': `Bearer ${this.userService.getToken()}` })
  }

  addTransacion(info: TransactionPost): Observable<any> {
    try {
      const resp = this.fetchRegisterTransaction(info)
      return resp
    } catch (error) {
      return throwError(() => new Error('Failed in create account.'))
    }
  }
  
    private fetchRegisterTransaction(tx: TransactionPost): Observable<any> {
      return this.http.post<any>(
        `${this.transactionUrl}`,
        { ...tx, userId: this.userService.getUserId() },
        { headers: this.headers }).pipe(
        catchError(() => {
          return throwError(() => new Error('Register transaction failed.'))
        })
      )
    }

    getTransacionByAccount(id: number) {
      try {
        const resp = this.fetchTransactionByAccount(id)
        return resp
      } catch (error) {
        return throwError(() => new Error('Failed get transactions account.'))
      }
    }

    private fetchTransactionByAccount(id: number): Observable<any> {
      return this.http.get(`${this.transactionUrl}/account/${id}`, {headers: this.headers})
        .pipe(
          catchError(() => {
            return throwError(() => new Error('Failed get transactions account.'))
          })
        )
    }

}

