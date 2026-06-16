import { inject } from '@angular/core';
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { ENV_CONFIG } from '../../core/config/environment.config';
import { Observable } from 'rxjs';
import { Page } from '../models/utils/page.model';

export abstract class BaseService<T> {
  protected readonly http = inject(HttpClient);
  private readonly config = inject(ENV_CONFIG);

  protected abstract readonly path: string;

  private get url(): string {
    return `${this.config.baseUrl}/${this.path}`;
  }

  protected get(path?: string, params?: HttpParams): Observable<T> {
    const url = path ? `${this.url}/${path}` : this.url;
    return this.http.get<T>(url, { params });
  }

  protected getPaged(path?: string, params?: HttpParams): Observable<Page<T>> {
    const url = path ? `${this.url}/${path}` : this.url;
    return this.http.get<Page<T>>(url, { params });
  }

  protected post<R>(body: R, path: string = '', context?: HttpContext): Observable<T> {
    return this.http.post<T>(`${this.url}/${path}`, body, { context });
  }

  protected put<R>(path: string, body: R): Observable<T> {
    return this.http.put<T>(`${this.url}/${path}`, body);
  }

  protected patch<R>(path: string, body: Partial<R>): Observable<T> {
    return this.http.patch<T>(`${this.url}/${path}`, body);
  }

  protected delete(path: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${path}`);
  }
}
