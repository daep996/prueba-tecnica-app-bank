import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

import { DialogTransactionContentComponent } from '../dialog-component/dialog-transaction-component.component';
import { AccountService } from '../../account/services/account.service';
import {MatStep, MatStepperModule} from '@angular/material/stepper';
import { TransactionService } from '../transaction.service';

interface AccountInfo {
  id: number;
  accountNumber: string;
  type: 'ahorros' | 'corriente';
  balance: number;
}

@Component({
  selector: 'app-transaction-create',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCard,
    MatCardTitle,
    MatCardHeader,
    MatCardContent,
    MatStepperModule,
    MatStep,
    MatOption,
    MatButton,
    MatCardActions,
    MatIcon,
    CommonModule
  ],
  templateUrl: './transaction-create.component.html',
  styleUrl: './transaction-create.component.css',
})
export class TransactionCreateComponent {
  accounts: AccountInfo[] = []
  sourceFormGroup: FormGroup
  destinationFormGroup: FormGroup
  

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private txService: TransactionService,
    private dialogRef: MatDialog,
    private router: Router
  ) {
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts.map(account => ({
          ...account,
          id: Number(account.id),
          type: account.type === 'ahorro' ? 'ahorros' : account.type
        }))
      },
      error: (err) => {
        console.error('Error al obtener las cuentas:', err)
      },
    })

    this.sourceFormGroup = this.fb.group({
      sourceAccount: ['', Validators.required]
    })
    
    this.destinationFormGroup = this.fb.group({
      destinationAccount: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      amount: [1, [Validators.required, Validators.min(1)]],
      concept: ['Transferencia entre cuentas', [Validators.required]]
    })

    this.sourceFormGroup.get('sourceAccount')?.valueChanges.subscribe((account: AccountInfo) => {
      if (account) {
        this.destinationFormGroup.get('amount')?.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(account.balance)
        ]);
        this.destinationFormGroup.get('amount')?.updateValueAndValidity()
      }
    })
  }

  canExecuteTransfer(): boolean {
    return this.sourceFormGroup.valid && this.destinationFormGroup.valid
  }

  executeTransfer(origin: any, destination: any): void {
    const payloadTransfer = {
      accountOriginId: origin.accountNumber as string,
      accountDestinationId: destination.destinationAccount as string,
      amount: Number(destination.amount),
      concept: destination.concept as string,
    }
    this.txService.addTransacion(payloadTransfer).subscribe(async (res) => {
      const { message} = res
      this.dialogRef.open(DialogTransactionContentComponent, { data: { message } }).afterClosed().subscribe(() => {
        this.router.navigate(['/account'])
      })
    })
  }

  goBack(): void {
    this.router.navigate(['/account'])
  }

}
