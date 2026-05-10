import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { jwtDecode, } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';
import { IfRideJwtPayload } from '../model/if-ride-jwt-payload';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly TOKEN_KEY = 'ifride_auth_token';

  saveToken(token: string): void {
    if(isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  loadTokenFromDisk(): string | null {
    if(isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  removeToken(): void {
    if(isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  isValid(token?: string): boolean {
    return this.performActionOnToken((decoded) => {
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp! > currentTime;
    }, token);
  }

  hasAdminPermission(token: string): boolean {
    return this.performActionOnToken((decoded) => {
      return decoded.role === 'ADMIN';
    }, token);
  }

  private performActionOnToken(callback: (payload: IfRideJwtPayload) => boolean, token?: string,): boolean {
    if (!token) return false;
    try {
      const decoded: IfRideJwtPayload = jwtDecode(token);
      return callback(decoded);
    } catch {
      return false;
    }
  }
}
