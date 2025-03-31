export interface Account {
    id: string;
    accountNumber: string;
    type: 'ahorro' | 'corriente';
    balance: number;
    currency: string;
    name: string;
  }