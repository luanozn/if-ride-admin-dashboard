import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationDetailsDialog } from '../application-details-dialog/application-details-dialog';
import { ListItemComponent } from '../../../shared/components/list-item/list-item.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ApplicationStore } from './state/application.store';
import { ApplicationStatus } from './state/models/application-status.enum';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Application } from './state/models/application.model';

@Component({
  selector: 'app-applications',
  imports: [ListItemComponent, MatPaginator, MatProgressSpinner],
  templateUrl: './application-list.html',
})
export class ApplicationList {
  applicationStore = inject(ApplicationStore);

  pageSize = 20;
  pageIndex = 0;

  constructor(private dialog: MatDialog) {}

  openDetails(usuario: Application) {
    const dialogRef = this.dialog.open(ApplicationDetailsDialog, {
      width: '500px',
      data: usuario,
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
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.applicationStore.getApplicationsByPage({
      status: ApplicationStatus.PENDING,
      page: this.pageIndex,
      size: this.pageSize,
    });
  }
}
