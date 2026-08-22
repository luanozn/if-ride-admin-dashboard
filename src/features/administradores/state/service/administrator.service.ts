import { Injectable } from '@angular/core';
import { BaseService } from '../../../../shared/service/base.service';
import { AdministratorDTO } from '../models/administrator-dto.model';
import { HttpParams } from '@angular/common/http';
import { Page } from '../../../../shared/models/utils/page.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdministratorService extends BaseService<AdministratorDTO> {
  protected override path = 'v1/admins';

  findAll(page?: number, size?: number, document?: string): Observable<Page<AdministratorDTO>> {
    let queryParams = new HttpParams({
      fromObject: {
        page: page ?? 0,
        size: size ?? 20,
        sort: 'name',
      }
    });

    if (document) {
      queryParams = queryParams.set('document', document);
    }

    return this.getPaged('', queryParams);
  }

  deleteAdministrator(administratorId: string): Observable<void> {
    return this.delete(administratorId);
  }
}
