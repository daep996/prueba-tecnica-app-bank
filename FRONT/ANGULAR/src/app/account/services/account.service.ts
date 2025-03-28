import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable, of } from 'rxjs';
import { Account } from '../models/account.model';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  // Mock data - in a real app, this would come from an API
  private mockAccounts: Account[] = [
    {
      id: '1',
      accountNumber: '1234-5678-9012-3456',
      accountType: 'savings',
      balance: 5000,
      currency: 'USD',
      name: 'Cuenta de Ahorros Principal'
    },
    {
      id: '2',
      accountNumber: '9876-5432-1098-7654',
      accountType: 'checking',
      balance: 2500,
      currency: 'USD',
      name: 'Cuenta Corriente'
    }
  ];

  private accountsSubject = new BehaviorSubject<Account[]>(this.mockAccounts);

  constructor(private userService: UserService, private http: HttpClient) { }

  getAccounts(): Observable<Account[]> {
    return this.fetchAccountsByUser();
    //TODO
    return this.accountsSubject.asObservable();
  }

  private fetchAccountsByUser() : Observable<Account[]> {
    const id = this.userService.getUserId()
    const headers = { 'Authorization': `Bearer ${this.userService.getToken()}` };
    return this.http.get<Account[]>(`http://localhost:3000/accounts/user/${id}`, { headers });
  }

  getAccountById(id: string): Observable<Account | undefined> {
    const account = this.mockAccounts.find(acc => acc.id === id);
    return of(account)
  }

  addAccount(account: Omit<Account, 'id'>): Observable<Account> {
    // Generate a random ID (in a real app, the backend would do this)
    const newAccount: Account = {
      ...account,
      id: Date.now().toString()
    };
    
    this.mockAccounts.push(newAccount);
    this.accountsSubject.next([...this.mockAccounts]);
    
    return of(newAccount);
  }
}
