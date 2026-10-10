import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { TokenService } from '../service/token.service';
import { IS_PUBLIC } from '../auth.context';
import { Router } from '@angular/router';
import { LoginStore } from '../login/state/user-login.store';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {

  const tokenService = inject(TokenService);
  const router = inject(Router);
  const loginStore = inject(LoginStore)

  if(req.context.get(IS_PUBLIC)) {
    return next(req);
  }
  const token = tokenService.loadTokenFromDisk();

  const authReq = token ? req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  }) : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        if (!router.url.startsWith('/login')) {
          loginStore.logout();
          router.navigate(['/login'], {
            queryParams: { returnUrl: router.url },
          });
        }
      }
      return throwError(() => err);
    }),
  );
}
