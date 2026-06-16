import { BaseService } from '../../../../../shared/service/base.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Application } from '../models/application.model';
import { ApplicationStatus } from '../models/application-status.enum';
import { HttpParams } from '@angular/common/http';
import { Page } from '../../../../../shared/models/utils/page.model';

@Injectable({ providedIn: 'root' })
export class ApplicationService extends BaseService<Application> {
  protected readonly path = 'v1/driver-requests';

  getDriverApplications(status?: ApplicationStatus, page?: number, size?: number): Observable<Page<Application>> {
    let queryParams: HttpParams = new HttpParams();

    if (status) {
      queryParams = queryParams.append('statuses', status);
    }

    if(page) {
      queryParams = queryParams.append('page', page);
    } else {
      queryParams = queryParams.append('page', 0);
    }

    queryParams = queryParams.append('size', size ?? 20)

    return this.getPaged(undefined, queryParams);
  }

  approveDriverApplication(userId: string): Observable<Application> {
    return this.patch<Application>(`${userId}/approve`, {});
  }

  rejectDriverApplication(userId: string, rejectionReason: string): Observable<Application> {
    return this.patch<Application>(`${userId}/reject`, { rejectionReason});
  }
}
