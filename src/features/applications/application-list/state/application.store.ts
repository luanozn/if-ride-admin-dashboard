import { computed, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap, tap } from 'rxjs';
import { ApplicationService } from './service/application.service';
import { ApplicationStatus } from './models/application-status.enum';
import { Application } from './models/application.model';
import { Page } from '../../../../shared/models/utils/page.model';

export type ApplicationStore = {
  entities: Application[];
  loading: boolean;
};

export const initialState: ApplicationStore = {
  entities: [],
  loading: false,
};

export const ApplicationStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ entities, loading }) => ({

    pendingApplications: computed(() =>
      entities().filter(app => app.applicationStatus === ApplicationStatus.PENDING)
    ),
    totalEntitiesOnPage: computed(() => entities().length),
    isInitialLoading: computed(() => loading() && entities().length === 0)

  })),
  withMethods(
    (store, applicationService = inject(ApplicationService), snack = inject(MatSnackBar)) => ({

      getApplicationsByPage: rxMethod<{ status: ApplicationStatus; page: number }>(
        pipe(
          tap(() => patchState(store, { entities: [], loading: true })),

          switchMap(({ status, page }) =>
            applicationService.getDriverApplications(status, page).pipe(
              tapResponse({
                next: (pagedResponse: Page<Application>) => {
                  patchState(store, {
                    entities: pagedResponse.content,
                    loading: false,
                  });
                },
                error: () => {
                  snack.open("Não foi possível carregar a lista de aplicações", 'Fechar', {
                    duration: 8000,
                    panelClass: ['error-snackbar'],
                  });
                  patchState(store, { loading: false });
                },
              })
            )
          )
        )
      ),
    })
  ),
  withHooks({
    onInit(store) {
      store.getApplicationsByPage({ status: ApplicationStatus.PENDING, page: 0 });
    },
    onDestroy() {
      console.log('ApplicationStore destruído');
    }
  })
);
