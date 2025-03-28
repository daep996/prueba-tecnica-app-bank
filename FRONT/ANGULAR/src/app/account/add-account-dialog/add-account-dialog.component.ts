import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';

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
    MatHint
  ]
})
export class AddAccountDialogComponent implements OnInit {
  accountForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddAccountDialogComponent>
  ) {
    this.accountForm = this.fb.group({
      name: ['', [Validators.required]],
      accountNumber: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{4}-\d{4}-\d{4}$/)]],
      accountType: ['savings', [Validators.required]],
      balance: [0, [Validators.required, Validators.min(0)]],
      currency: ['USD', [Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.accountForm.valid) {
      this.dialogRef.close(this.accountForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}