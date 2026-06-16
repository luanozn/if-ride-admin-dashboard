import { computed, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { firstValueFrom, pipe, switchMap, tap } from 'rxjs';
import { ApplicationService } from './service/application.service';
import { ApplicationStatus } from './models/application-status.enum';
import { Application } from './models/application.model';
import { Page } from '../../../../shared/models/utils/page.model';

export type ApplicationStore = {
  entities: Application[];
  totalItems: number;
  loading: boolean;
};

export const initialState: ApplicationStore = {
  entities: [],
  totalItems: 0,
  loading: false,
};

export const ApplicationStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ entities, loading, totalItems }) => ({

    pendingApplications: computed(() =>
      entities().filter(app => app.applicationStatus === ApplicationStatus.PENDING)
    ),
    totalEntitiesOnPage: computed(() => entities().length),
    totalEntities: computed(()=> totalItems()),
    isInitialLoading: computed(() => loading() && entities().length === 0)

  })),
  withMethods(
    (store, applicationService = inject(ApplicationService), snack = inject(MatSnackBar)) => ({

      getApplicationsByPage: rxMethod<{ status: ApplicationStatus; page: number, size: number }>(
        pipe(
          tap(() => patchState(store, { entities: [], loading: true })),

          switchMap(({ status, page }) =>
            applicationService.getDriverApplications(status, page).pipe(
              tapResponse({
                next: (pagedResponse: Page<Application>) => {
                  patchState(store, {
                    entities: pagedResponse.content,
                    totalItems: pagedResponse.totalElements,
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

      async approve(userId: string): Promise<boolean> {
        patchState(store, { loading: true });
        try {
          await firstValueFrom(applicationService.approveDriverApplication(userId));

          const updatedEntities = store.entities().filter(app => app.requester.id !== userId);
          patchState(store, { entities: updatedEntities, loading: false });

          snack.open('Aplicação aprovada com sucesso', 'Fechar', { duration: 4000 });
          return true;
        } catch (error) {
          patchState(store, { loading: false });
          snack.open('Erro ao aprovar aplicação', 'Fechar', { duration: 8000, panelClass: ['error-snackbar'] });
          return false;
        }
      },

      async reject(userId: string, reason: string): Promise<boolean> {
        patchState(store, { loading: true });
        try {
          await firstValueFrom(applicationService.rejectDriverApplication(userId, reason));

          const updatedEntities = store.entities().filter(app => app.requester.id !== userId);
          patchState(store, { entities: updatedEntities, loading: false });

          snack.open('Aplicação rejeitada com sucesso', 'Fechar', { duration: 4000 });
          return true;
        } catch (error) {
          patchState(store, { loading: false });
          snack.open('Erro ao rejeitar aplicação', 'Fechar', { duration: 8000, panelClass: ['error-snackbar'] });
          return false;
        }
      }
    })
  ),
  withHooks({
    onInit(store) {
      store.getApplicationsByPage({ status: ApplicationStatus.PENDING, page: 0, size: 20 });
    },
    onDestroy() {
      console.log('ApplicationStore destruído');
    }
  })
);
