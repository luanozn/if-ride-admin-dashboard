import { BaseService } from '../../../../../shared/service/base.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Application } from '../models/application.model';
import { ApplicationStatus } from '../models/application-status.enum';
import { HttpParams } from '@angular/common/http';
import { Page } from '../../../../../shared/models/utils/page.model';
import { ApplicationDTO } from '../models/application-dto.model';

@Injectable({ providedIn: 'root' })
export class ApplicationService extends BaseService<ApplicationDTO> {
  protected readonly path = 'v1/driver-requests';

  getDriverApplications(status?: ApplicationStatus, page?: number, size?: number, document?: string): Observable<Page<ApplicationDTO>> {
    let queryParams = new HttpParams({
      fromObject: {
        page: page ?? 0,
        size: size ?? 20,
      }
    });
    if (status) {
      queryParams = queryParams.append('statuses', status);
    }
    if(document) {
      queryParams = queryParams.append('document', document);
    }

    return this.getPaged(undefined, queryParams);
  }

  approveDriverApplication(userId: string): Observable<ApplicationDTO> {
    return this.patch<Application>(`${userId}/approve`, {});
  }

  rejectDriverApplication(userId: string, rejectionReason: string): Observable<ApplicationDTO> {
    return this.patch<Application>(`${userId}/reject`, { rejectionReason});
  }
}
