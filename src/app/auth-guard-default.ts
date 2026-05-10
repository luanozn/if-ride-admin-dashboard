import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../core/auth/service/token.service';
import { inject } from '@angular/core';
import { LoginStore } from '../core/auth/login/state/user-login.store';
import { jwtDecode } from 'jwt-decode';

export const defaultAuthGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const loginStore = inject(LoginStore);

  const rawToken = tokenService.loadTokenFromDisk();

  console.log('--- DEBUG DO GUARD ---');
  console.log('1. Token está no disco?', !!rawToken);

  if (rawToken) {
    console.log('2. O token é válido?', tokenService.isValid(rawToken));
    console.log('3. Possui permissão ADMIN?', tokenService.hasAdminPermission(rawToken));

    try {
      const decoded = jwtDecode(rawToken);
      console.log('4. Estrutura Real do Payload:', decoded);
    } catch (e) {
      console.error('Falha severa ao decodificar o token', e);
    }
  }
  console.log('----------------------');

  let token = loginStore.token();
  if(!token) {
    const tokenFromDisk = tokenService.loadTokenFromDisk();

    if (tokenFromDisk && tokenService.isValid(tokenFromDisk) && tokenService.hasAdminPermission(tokenFromDisk)) {
      loginStore.rehydrate();
      return router.parseUrl('/dashboard');
    }
  }

  if (token && tokenService.isValid(token) && tokenService.hasAdminPermission(token)) {
    return router.parseUrl('/dashboard');
  }

  return router.parseUrl('/login');
};

export const dashboardAuthGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const loginStore = inject(LoginStore);

  const rawToken = tokenService.loadTokenFromDisk();

  console.log('--- DEBUG DO GUARD ---');
  console.log('1. Token está no disco?', !!rawToken);

  if (rawToken) {
    console.log('2. O token é válido?', tokenService.isValid(rawToken));
    console.log('3. Possui permissão ADMIN?', tokenService.hasAdminPermission(rawToken));

    try {
      const decoded = jwtDecode(rawToken);
      console.log('4. Estrutura Real do Payload:', decoded);
    } catch (e) {
      console.error('Falha severa ao decodificar o token', e);
    }
  }
  console.log('----------------------');

  let token = loginStore.token();
  if(!token) {
    const tokenFromDisk = tokenService.loadTokenFromDisk();

    if (tokenFromDisk && tokenService.isValid(tokenFromDisk) && tokenService.hasAdminPermission(tokenFromDisk)) {
      loginStore.rehydrate();
      return true;
    }
  }

  if (token && tokenService.isValid(token) && tokenService.hasAdminPermission(token)) {
    return true;
  }

  return router.parseUrl('/login');
};
