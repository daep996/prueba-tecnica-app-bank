export interface Account {
    id: string;
    accountNumber: string;
    accountType: 'savings' | 'checking';
    balance: number;
    currency: string;
    name: string;
  }