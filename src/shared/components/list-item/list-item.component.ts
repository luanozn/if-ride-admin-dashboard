import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Application } from '../../../features/applications/application-list/state/models/application.model';

@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  host: {
    class: 'block'
  },
  templateUrl: './list-item.component.html'
})
export class ListItemComponent {
  @Input({ required: true }) user!: Application;

  @Input() showDetails = false;
  @Input() showDeleteIcon = false;

  @Output() actionDetails = new EventEmitter<void>();
  @Output() actionDelete = new EventEmitter<void>();
}
