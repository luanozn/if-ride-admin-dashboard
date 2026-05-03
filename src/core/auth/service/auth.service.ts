import { BaseService } from '../../../shared/service/base.service';
import { LoginResponse } from '../model/login-response.model';
import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpContext } from '@angular/common/http';
import { IS_PUBLIC } from '../auth.context';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseService<LoginResponse> {
  protected readonly tokenService: TokenService = inject(TokenService);

  protected readonly path = 'v1/auth';

  login(email: string, password: string): void {
    this.post(
      {
        email,
        password,
      },
      'login',
      new HttpContext().set(IS_PUBLIC, true),
    ).subscribe((token) => this.tokenService.saveToken(token.token));
  }
}
