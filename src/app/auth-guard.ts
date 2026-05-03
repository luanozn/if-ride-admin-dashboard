import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../core/auth/service/token.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.isValid()) {
    return true;
  }

  return router.parseUrl('/login');
};
