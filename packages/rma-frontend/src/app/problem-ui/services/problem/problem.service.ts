import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { from } from 'rxjs';
import {
  ACCESS_TOKEN,
  AUTHORIZATION,
  BEARER_TOKEN_PREFIX,
} from '../../../constants/storage';
import { map, switchMap } from 'rxjs/operators';
import { APIResponse } from '../../../common/interfaces/sales.interface';
import {
  LIST_PROBLEMS_ENDPOINT,
  ADD_PROBLEM_ENDPOINT,
  UPDATE_PROBLEM_ENDPOINT,
  GET_PROBLEM_ENDPOINT,
  DELETE_PROBLEM_ENDPOINT,
} from '../../../constants/url-strings';
import { StorageService } from '../../../api/storage/storage.service';
import { Problem } from '../../../common/interfaces/problem-interface';
@Injectable({
  providedIn: 'root',
})
export class ProblemService {
  constructor(private http: HttpClient, private storage: StorageService) {}

  getProblemList(search = '', sort = 'ASC', pageNumber = 0, pageSize = 30) {
    const url = LIST_PROBLEMS_ENDPOINT;
    const params = new HttpParams()
      .set('limit', pageSize.toString())
      .set('offset', (pageNumber * pageSize).toString())
      .set('search', search)
      .set('sort', sort);

    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<APIResponse>(url, {
          params,
          headers,
        });
      }),
    );
  }

  getHeaders() {
    return from(this.storage.getItem(ACCESS_TOKEN)).pipe(
      map(token => {
        return {
          [AUTHORIZATION]: BEARER_TOKEN_PREFIX + token,
        };
      }),
    );
  }

  getProblem(uuid: string) {
    const url = `${GET_PROBLEM_ENDPOINT}/${uuid}`;
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<Problem>(url, {
          headers,
        });
      }),
    );
  }

  addProblem(problem_name: string) {
    const url = ADD_PROBLEM_ENDPOINT;
    const body = { problem_name };
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(url, body, {
          headers,
        });
      }),
    );
  }

  updateProblem(problem_name: string, uuid: string) {
    const url = UPDATE_PROBLEM_ENDPOINT;
    const body = { problem_name, uuid };
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(url, body, {
          headers,
        });
      }),
    );
  }

  deleteProblem(uuid: string) {
    const url = `${DELETE_PROBLEM_ENDPOINT}/${uuid}`;
    const body = {};
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(url, body, {
          headers,
        });
      }),
    );
  }
}
