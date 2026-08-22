import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationDetailsDialog } from '../application-details-dialog/application-details-dialog';
import { PageEvent } from '@angular/material/paginator';
import { ApplicationStore } from './state/application.store';
import { ApplicationStatus } from './state/models/application-status.enum';
import { Application } from './state/models/application.model';
import { GenericList } from '../../../shared/components/generic-list/generic-list';

@Component({
  selector: 'app-applications',
  imports: [GenericList],
  templateUrl: './application-list.html',
  standalone: true,
})
export class ApplicationList {
  applicationStore = inject(ApplicationStore);
  private dialog = inject(MatDialog);

  pageIndex = 0;
  pageSize = 20;
  currentDocument?: string;

  openDetails(user: Application) {
    this.dialog.open(ApplicationDetailsDialog, {
      width: '500px',
      data: user,
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.applicationStore.getApplicationsByPage({
      status: ApplicationStatus.PENDING,
      page: this.pageIndex,
      size: this.pageSize,
    });
  }

  applySearch(document: string) {
    this.pageIndex = 0;
    this.pageSize = 20;
    this.currentDocument = document;

    this.applicationStore.getApplicationsByPage({
      status: ApplicationStatus.PENDING,
      page: this.pageIndex,
      size: this.pageSize,
      document: document,
    });
  }
}
