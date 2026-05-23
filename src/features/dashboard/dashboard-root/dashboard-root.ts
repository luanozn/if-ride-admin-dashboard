import { Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatSuffix } from '@angular/material/input';
import { TokenService } from '../../../core/auth/service/token.service';
import { LoginStore } from '../../../core/auth/login/state/user-login.store';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard-root',
  imports: [MatIconButton, MatIcon],
  templateUrl: './dashboard-root.html',
})
export class DashboardRoot {
  private readonly tokenService = inject(TokenService);
  private readonly store = inject(LoginStore);
  private readonly router = inject(Router);

  async logout(): Promise<void> {
    await this.store.logout();
    this.tokenService.removeToken();
    await this.router.navigate(['/login']);
  }
}
