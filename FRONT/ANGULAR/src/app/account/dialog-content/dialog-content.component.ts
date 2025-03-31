import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-content',
  template: `
    <h2 mat-dialog-title>Cuenta creada correctamente</h2>
    <mat-dialog-content>
      <mat-icon aria-hidden="false" aria-label="Cuenta creada" fontIcon="task_alt"></mat-icon>
      Su cuenta fue creada correctamente: <strong>{{data.accountNumber}}</strong>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatIconModule,
    MatButtonModule
  ],
})
export class DialogContentComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { accountNumber: string }) {}
}
