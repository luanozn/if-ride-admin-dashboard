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
})
export class ApplicationList {
  applicationStore = inject(ApplicationStore);

  constructor(private dialog: MatDialog) {}

  openDetails(user: Application) {
    const dialogRef = this.dialog.open(ApplicationDetailsDialog, {
      width: '500px',
      data: user,
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado?.action === 'REJECT') {
        console.log('Recusado por:', resultado.reason);
      } else if (resultado?.action === 'APPROVE') {
        console.log('Aprovado');
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.applicationStore.getApplicationsByPage({
      status: ApplicationStatus.PENDING,
      page: event.pageIndex,
      size: event.pageSize,
    });
  }
}
