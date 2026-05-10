import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { inject } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { LoginRequest } from '../../model/login-request.model';
import { TokenService } from '../../service/token.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ForbiddenException } from '../../../../shared/models/exceptions/forbidden.exception';
import { HttpErrorResponse } from '@angular/common/http';

export type LoginState = {
  email: string | null;
  token: string | null;
  expiration: number | null;
  isLoading: boolean;
};

export const initialState: LoginState = {
  email: null,
  token: null,
  expiration: null,
  isLoading: false,
};

export const LoginStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      authService = inject(AuthService),
      tokenService = inject(TokenService),
      router = inject(Router),
      snack = inject(MatSnackBar),
    ) => ({
      rehydrate() {
        const token = tokenService.loadTokenFromDisk();
        if (token && tokenService.isValid(token) && tokenService.hasAdminPermission(token)) {
          patchState(store, { token });
        } else {
          tokenService.removeToken();
          patchState(store, { token: null });
        }
      },

      async logout() {
        tokenService.removeToken();
        patchState(store, {
          token: null,
          email: null,
          expiration: null,
        });
      },

      async login(loginRequest: LoginRequest) {
        patchState(store, { isLoading: true });
        try {
          const authInfo = await authService.login(loginRequest);
          if (!tokenService.hasAdminPermission(authInfo.token)) {
            await this.logout();
            throw new ForbiddenException('Você não tem permissão para acessar o painel administrativo.');
          }

          tokenService.saveToken(authInfo.token);
          patchState(store, {
            email: loginRequest.email,
            token: authInfo.token,
            expiration: authInfo.expireDate,
            isLoading: false,
          });
          await router.navigate(['/dashboard']);

        } catch (error) {
          let errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.';

          if (error instanceof HttpErrorResponse) {
            if (error.status === 401 || error.status === 403) {
              errorMessage = 'E-mail ou senha incorretos!';
            } else if (error.status === 0) {
              errorMessage = 'Não foi possível conectar ao servidor.';
            }
          }
          else if (error instanceof ForbiddenException || error instanceof Error) {
            errorMessage = error.message;
          }

          snack.open(errorMessage, 'Fechar', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        }
      },
    }),
  ),
  withHooks((store) => ({
    onInit() {
      store.rehydrate();
    },
  })),
);
