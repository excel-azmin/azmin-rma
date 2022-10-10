import { Injectable, Inject } from '@angular/core';
import { from, of, throwError, Observable } from 'rxjs';
import { switchMap, retry, catchError, delay } from 'rxjs/operators';
export const STORAGE_TOKEN = 'StorageObject';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(@Inject(STORAGE_TOKEN) private readonly storage) {}

  async getItem(key: string) {
    return await this.storage.getItem(key);
  }

  async setItem(key: string, value: unknown) {
    return await this.storage.setItem(key, value);
  }

  async removeItem(key: string) {
    return await this.storage.removeItem(key);
  }

  async clear() {
    return await this.storage.clear();
  }

  async getItems(keys: string[]) {
    const data = {};
    for (const key of keys) {
      if (key) {
        data[keys[key]] = await this.getItem(keys[key]);
      }
    }
    return data;
  }

  getItemAsync(key: string, filter?: string): Observable<any> {
    return of({}).pipe(
      switchMap(obj => {
        return from(this.getItem(key)).pipe(
          switchMap(item => {
            if (item) {
              return filter ? of(this._filter(filter, item)) : of(item);
            }
            return throwError('Item Not Found').pipe(delay(400));
          }),
        );
      }),
      retry(9),
      catchError(err => {
        return of(undefined);
      }),
    );
  }

  _filter(value: string, state: string[]): string[] {
    const filterValue = value.toLowerCase();

    return state.filter(option => option.toLowerCase().includes(filterValue));
  }
}
