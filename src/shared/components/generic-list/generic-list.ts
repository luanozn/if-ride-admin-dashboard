import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ListItemComponent } from '../list-item/list-item.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ShowableEntity } from '../../models/utils/showable-entity.model';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, filter, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


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
  ],
  templateUrl: './generic-list.html',
  standalone: true,
})
export class GenericList<T extends ShowableEntity> implements OnInit {
  @Input() title: string = '';
  @Input() totalEntities: number = 0;
  @Input() loading: boolean = false;
  @Input() entities: T[] = [];
  @Input() showDetails = false;
  @Input() showDeletionIcon = false;
  @Input() showCreationButton = false;
  @Input() showSearch = false;
  @Input() showExactMatchButton = false;
  @Input() entityName: string = '';
  @Input() searchLabel = 'Buscar';
  @Input() searchPlaceholder = '';
  @Input() searchInputMode: 'text' | 'numeric' = 'text';
  @Input() searchMinChars = 0;
  @Input() searchTrigger: 'debounce' | 'enter' = 'debounce';

  @Input() searchDebounceMs = 500;

  @Output() searchChanged = new EventEmitter<string>();
  @Output() openDetails: EventEmitter<T> = new EventEmitter();
  @Output() pageChange: EventEmitter<PageEvent> = new EventEmitter();
  @Output() createButtonClicked = new EventEmitter();
  @Output() deleteButtonClicked = new EventEmitter();

  private destroyRef = inject(DestroyRef);
  private inputTerm$ = new Subject<string>();

  pageSize = 20;
  pageIndex = 0;

  ngOnInit(): void {
    this.inputTerm$
      .pipe(
        debounceTime(this.searchTrigger === 'debounce' ? this.searchDebounceMs : 0),
        distinctUntilChanged(),
        filter((term) => term.length >= this.searchMinChars),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((term) => this.searchChanged.emit(term));
  }

  onSearchInput(value: string): void {
    if(this.searchTrigger === 'debounce') {
      this.inputTerm$.next(value);
    }
  }

  onEnter(value: string): void {
    if (this.searchTrigger === 'enter') {
      this.inputTerm$.next(value);
    }
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;

    this.pageChange.emit(event);
  }
}
