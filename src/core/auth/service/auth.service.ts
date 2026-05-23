import { BaseService } from '../../../shared/service/base.service';
import { LoginResponse } from '../model/login-response.model';
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpContext } from '@angular/common/http';
import { IS_PUBLIC } from '../auth.context';
import { LoginRequest } from '../model/login-request.model';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseService<LoginResponse> {
  protected readonly path = 'v1/auth';

  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    return await firstValueFrom(this.post(
      loginRequest,
      'login',
      new HttpContext().set(IS_PUBLIC, true),
    ));
  }
}
