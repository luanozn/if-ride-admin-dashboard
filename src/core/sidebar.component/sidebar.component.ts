import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TokenService } from '../auth/service/token.service';
import { LoginStore } from '../auth/login/state/user-login.store';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule
  ],
  providers: [TokenService],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {

  protected readonly loginStore = inject(LoginStore)
  protected readonly router = inject(Router);

  async onClickExit(): Promise<void> {
    await this.loginStore.logout();
    await this.router.navigate(['/login']);
  }
}
