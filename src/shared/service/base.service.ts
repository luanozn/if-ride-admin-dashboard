import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENV_CONFIG } from '../../core/config/environment.config';

export abstract class BaseService<T> {
  protected readonly http = inject(HttpClient);
  private readonly config = inject(ENV_CONFIG);

  protected abstract readonly path: string;

  private get url(): string {
    return `${this.config.baseUrl}/${this.path}`;
  }

}
