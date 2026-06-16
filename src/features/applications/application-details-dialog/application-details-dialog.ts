import { Component, inject, Inject } from '@angular/core';
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
import { Application } from '../application-list/state/models/application.model';
import { ApplicationStore } from '../application-list/state/application.store'; // <-- Necessário para o *ngIf

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
  showDenyInput = false;
  denialReason = new FormControl('', [Validators.required, Validators.maxLength(255)]);

  applicationStore = inject(ApplicationStore);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Application,
    private dialogRef: MatDialogRef<ApplicationDetailsDialog>,
  ) {}

  showDeny() {
    this.showDenyInput = true;
  }

  async denyApplication() {
    if (this.denialReason.invalid) {
      this.denialReason.markAsTouched();
      return;
    }

    const isSuccess = await this.applicationStore.reject(this.data.requester.id, this.denialReason.value!);

    if (isSuccess) {
      this.dialogRef.close();
    }
  }

  async approveApplication() {
    const isSuccess = await this.applicationStore.approve(this.data.requester.id);

    if (isSuccess) {
      this.dialogRef.close();
    }
  }
}
