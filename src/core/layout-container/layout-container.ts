import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar.component/sidebar.component';

@Component({
  selector: 'app-layout-container',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './layout-container.html',
})
export class LayoutContainer {}
