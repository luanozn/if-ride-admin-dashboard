import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListItemComponent } from '../list-item/list-item.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ShowableEntity } from '../../models/utils/showable-entity.model';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';


@Component({
  selector: 'app-list',
  imports: [
    ListItemComponent,
    MatPaginator,
    MatProgressSpinner,
    MatButton,
    MatIcon,
    MatFormField,
    MatLabel,
    MatInput,
    MatIconButton,
  ],
  templateUrl: './generic-list.html',
  standalone: true,
})
export class GenericList<T extends ShowableEntity> {
  @Input() title: string = '';
  @Input() totalEntities: number = 0;
  @Input() loading: boolean = false;
  @Input() entities: T[] = [];
  @Input() showDetails = false;
  @Input() showDeletionIcon = false;
  @Input() showCreationButton = false;
  @Input() showSearchButton = false;
  @Input() entityName: string = '';

  @Output() openDetails: EventEmitter<T> = new EventEmitter();
  @Output() pageChange: EventEmitter<PageEvent> = new EventEmitter();
  @Output() searchButtonClicked: EventEmitter<string> = new EventEmitter();
  @Output() createButtonClicked = new EventEmitter();
  @Output() deleteButtonClicked = new EventEmitter();

  pageSize = 20;
  pageIndex = 0;

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;

    this.pageChange.emit(event);
  }
}
