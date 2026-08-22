import { AdministratorDTO } from './models/administrator-dto.model';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { firstValueFrom, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { Page } from '../../../shared/models/utils/page.model';
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
      getAdministratorsByPage: rxMethod<{ page: number; size: number, document?: string }>(
        pipe(
          tap(() => patchState(store, { entities: [], loading: true })),

          switchMap(({ page, size, document }) =>
            administratorService.findAll(page, size, document).pipe(
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

      async delete(adminId: string): Promise<boolean> {
        patchState(store, { loading: true });
        try {
          await firstValueFrom(administratorService.deleteAdministrator(adminId));

          const updatedEntities = store.entities().filter(adm => adm.id !== adminId);
          patchState(store, { entities: updatedEntities, loading: false });

          snack.open('Administrador deletado com sucesso', 'Fechar', { duration: 4000 });
          return true;
        } catch (error) {
          patchState(store, { loading: false });
          snack.open('Erro ao deletar o administrador', 'Fechar', { duration: 8000, panelClass: ['error-snackbar'] });
          return false;
        }
      },
    }),
  ),

  withHooks({
    onInit(store) {
      store.getAdministratorsByPage({ page: 0, size: 20, document: '' });
    },
    onDestroy() {
      console.log('ApplicationStore destruído');
    }
  })
);
