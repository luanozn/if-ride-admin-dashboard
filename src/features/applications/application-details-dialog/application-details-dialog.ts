import { Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatError, MatFormField, MatHint, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon'; // <-- Importante adicionar o MatIcon
import { NgIf } from '@angular/common';
import { Application } from '../application-list/state/models/application.model'; // <-- Necessário para o *ngIf

@Component({
  selector: 'app-application-details-dialog',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatInput,
    MatHint,
    MatError,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatIcon,
    NgIf
  ],
  templateUrl: './application-details-dialog.html',
})
export class ApplicationDetailsDialog {
  exibirInputRecusa = false;
  motivoRecusa = new FormControl('', [Validators.required, Validators.maxLength(255)]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Application,
    private dialogRef: MatDialogRef<ApplicationDetailsDialog>,
  ) {}

  iniciarRecusa() {
    this.exibirInputRecusa = true;
  }

  confirmarRecusa() {
    if (this.motivoRecusa.invalid) {
      this.motivoRecusa.markAsTouched();
      return;
    }
    this.dialogRef.close({
      action: 'REJECT',
      reason: this.motivoRecusa.value,
    });
  }

  aprovar() {
    this.dialogRef.close({ action: 'APPROVE' });
  }
}
