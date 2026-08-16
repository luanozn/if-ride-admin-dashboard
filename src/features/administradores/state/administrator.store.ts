import { AdministratorDTO } from './models/administrator-dto.model';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { ApplicationStatus } from '../../applications/application-list/state/models/application-status.enum';
import { ApplicationService } from '../../applications/application-list/state/service/application.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { Page } from '../../../shared/models/utils/page.model';
import { Application } from '../../applications/application-list/state/models/application.model';
import { AdministratorService } from './service/administrator.service';
import { Administrator } from './models/administrator.model';

export type AdministratorStore = {
  entities: Administrator[];
  totalItems: number;
  loading: boolean;
};

export const initialState: AdministratorStore = {
  entities: [],
  totalItems: 0,
  loading: false,
};

export const AdministratorStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ entities, loading, totalItems }) => ({
    totalEntitiesOnPage: computed(() => entities().length),
    totalEntities: computed(() => totalItems()),
    isInitialLoading: computed(() => loading() && entities().length === 0),
  })),

  withMethods(
    (store, administratorService = inject(AdministratorService), snack = inject(MatSnackBar)) => ({
      getAdministratorsByPage: rxMethod<{ page: number; size: number }>(
        pipe(
          tap(() => patchState(store, { entities: [], loading: true })),

          switchMap(({ page, size }) =>
            administratorService.findAll(page, size).pipe(
              tapResponse({
                next: (pagedResponse: Page<AdministratorDTO>) => {
                  patchState(store, {
                    entities: pagedResponse.content.map(item => Administrator.from(item)),
                    totalItems: pagedResponse.totalElements,
                    loading: false,
                  });
                },
                error: () => {
                  snack.open('Não foi possível carregar a lista de administradores', 'Fechar', {
                    duration: 8000,
                    panelClass: ['error-snackbar'],
                  });
                  patchState(store, { loading: false });
                },
              }),
            ),
          ),
        ),
      ),
    }),
  ),

  withHooks({
    onInit(store) {
      store.getAdministratorsByPage({ page: 0, size: 20 });
    },
    onDestroy() {
      console.log('ApplicationStore destruído');
    }
  })
);
