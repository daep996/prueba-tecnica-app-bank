import { MatDialog, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { DialogContentComponent } from '../dialog-content/dialog-content.component';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-add-account-dialog',
  templateUrl: './add-account-dialog.component.html',
  styleUrls: ['./add-account-dialog.component.css'],
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatSelect,
    MatOption,
    MatDialogActions,
    MatDialogContent,
    MatInputModule,
    CommonModule,
    MatHint,
    MatButton
  ]
})
export class AddAccountDialogComponent {
  accountForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private dialogRef: MatDialogRef<AddAccountDialogComponent>,
    private dialog: MatDialog,
  ) {
    this.accountForm = this.fb.group({
      accountType: ['savings', [Validators.required]],
      balance: [0, [Validators.required, Validators.min(0)]],
    });
  }

  onSubmit(): void {
    if (this.accountForm.valid) {
      const {accountType, balance} = this.accountForm.value
      this.accountService.addAccount(accountType, balance).subscribe(async (account) => {
        const { accountNumber } = account
        this.onSuccessModal(accountNumber)
      })
      this.dialogRef.close()
    }
  }

  onCancel(): void {
    this.dialogRef.close()
  }

  onSuccessModal(accountNumber: string): void {
    this.dialog.open(DialogContentComponent, {
      data: { accountNumber }
    });
  }

}
