import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ENV_CONFIG } from '../../core/config/environment.config';
import { Observable } from 'rxjs';

export abstract class BaseService<T> {
  protected readonly http = inject(HttpClient);
  private readonly config = inject(ENV_CONFIG);

  protected abstract readonly path: string;

  private get url(): string {
    return `${this.config.baseUrl}/${this.path}`;
  }

  get(path: string, params?: HttpParams): Observable<T | T[]> {
    return this.http.get<T | T[]>(`${this.url}/${path}`, { params });
  }

  post<R>(body: R, path: string = ''): Observable<T> {
    return this.http.post<T>(`${this.url}/${path}`, body);
  }

  put<R>(path: string, body: R): Observable<T> {
    return this.http.put<T>(`${this.url}/${path}`, body);
  }

  patch<R>(path: string, body: Partial<R>): Observable<T> {
    return this.http.patch<T>(`${this.url}/${path}`, body);
  }

  delete(path: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${path}`);
  }
}
