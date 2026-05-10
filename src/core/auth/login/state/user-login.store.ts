import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { LoginRequest } from '../../model/login-request.model';

type LoginState = {
  email: string;
  token: string;
  expiration: number;
}

const initialState = {} as LoginState;

export const LoginStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    isLoggedIn: computed(() => !!store.token() && store.expiration() > Date.now())
  })),
  withMethods((store, authService = inject(AuthService)) => ({
    async login(loginRequest: LoginRequest) {
      const authInfo = await authService.login(loginRequest);
      patchState(store, {
        email: loginRequest.email,
        token: authInfo.token,
        expiration: authInfo.expireDate
      })
      return authInfo;
    },
  })),
);
