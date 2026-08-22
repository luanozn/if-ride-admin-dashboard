import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdminFormDialogComponent } from './admin-form-dialog/admin-form-dialog.component';
import { PageEvent } from '@angular/material/paginator';
import { AdministratorStore } from './state/administrator.store';
import { GenericList } from '../../shared/components/generic-list/generic-list';

@Component({
  selector: 'app-administradores',
  imports: [GenericList],
  templateUrl: './administrators.component.html',
  standalone: true,
})
export class Administrators {
  administratorStore = inject(AdministratorStore);
  pageSize = 20;
  pageIndex = 0;
  currentDocument?: string;

  constructor(private dialog: MatDialog) {}

  openCreateAdminDialog() {
    this.dialog.open(AdminFormDialogComponent, {
      width: '600px',
      disableClose: true,
    });
  }

  deleteAdmin(id: string) {
    this.administratorStore.delete(id);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.administratorStore.getAdministratorsByPage({
      page: this.pageIndex,
      size: this.pageSize,
      document: this.currentDocument
    });
  }

  applySearch(document: string) {
    this.currentDocument = document;
    this.pageIndex = 0;
    this.pageSize = 20;

    this.administratorStore.getAdministratorsByPage({
      page: this.pageIndex,
      size: this.pageSize,
      document: document,
    })
  }
}
