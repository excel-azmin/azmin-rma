import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { from, forkJoin, of } from 'rxjs';
import {
  ACCESS_TOKEN,
  AUTHORIZATION,
  BEARER_TOKEN_PREFIX,
  LOGGED_IN,
  AUTH_SERVER_URL,
} from '../constants/storage';
import {
  DIRECT_PROFILE_ENDPOINT,
  //  IS_BACKEND_CONNECTED_ENDPOINT,
  CONNECT_BACKEND_ENDPOINT,
} from '../constants/url-strings';
import { IDTokenClaims } from '../common/interfaces/id-token-claims.interfaces';
import { LoginService } from '../api/login/login.service';
import { StorageService } from '../api/storage/storage.service';
import { AppService } from '../app.service';
import { DURATION } from '../constants/app-string';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  loggedIn: boolean;
  picture: string;
  state: string;
  email: string;
  fullName: string;
  spinner = true;
  noteList: NoteInterface[] = [];

  constructor(
    private readonly http: HttpClient,
    private readonly login: LoginService,
    private readonly storage: StorageService,
    private readonly router: Router,
    private readonly appService: AppService,
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map((event: any) => {
          this.spinner = true;
          if (event.url === '/home') {
            this.loadProfile();
            this.loadNoteList();
            return event;
          }
        }),
      )
      .subscribe({
        next: res => {
          this.storage.getItem(AUTH_SERVER_URL).then(url => {
            if (!url) {
              this.appService.getMessage().subscribe({
                next: success => this.appService.setInfoLocalStorage(success),
                error: error => {},
              });
            }
          });
        },
        error: err => {},
      });
    this.setUserSession();
    this.loadProfile();
    this.loadNoteList();
  }

  setUserSession() {
    this.login.changes.subscribe({
      next: event => {
        if (event.key === LOGGED_IN && event.value === false) {
          this.loggedIn = false;
        }
      },
      error: error => {},
    });
  }

  loadProfile() {
    if (this.email && this.fullName) {
      this.spinner = false;
      return;
    }
    from(this.storage.getItem(ACCESS_TOKEN))
      .pipe(
        delay(DURATION),
        switchMap(token => {
          this.loggedIn = token ? true : false;
          const headers = {
            [AUTHORIZATION]: BEARER_TOKEN_PREFIX + token,
          };

          return forkJoin({
            profile: this.http.get<IDTokenClaims>(DIRECT_PROFILE_ENDPOINT, {
              headers,
            }),
            token: of(token),
          });
        }),
      )
      .subscribe({
        error: error => this.appService.setupImplicitFlow(),
        next: ({ profile, token }) => {
          this.spinner = false;
          this.email = profile.email;
          this.fullName = profile.name;
          // this.checkBackendConnection(token);
        },
      });
  }

  // checkBackendConnection(token: string) {
  //   const headers = {
  //     [AUTHORIZATION]: BEARER_TOKEN_PREFIX + token,
  //   };
  //   this.http
  //     .get<{ isConnected: boolean }>(IS_BACKEND_CONNECTED_ENDPOINT, { headers })
  //     .subscribe({
  //       next: res => {
  //         if (!res.isConnected) {
  //           window.location.href =
  //             CONNECT_BACKEND_ENDPOINT + '?access_token=' + token;
  //         }
  //       },
  //     });
  // }

  loadNoteList() {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    const date = [
      currentDate.getDate(),
      currentDate.getMonth() + 1,
      currentDate.getFullYear(),
    ].join('-');

    this.appService.getNoteList(date).subscribe({
      next: (response: { data: any[] }) => {
        this.noteList = response.data;
      },
      error: err => {},
    });
  }

  connectBackend() {
    window.location.href = CONNECT_BACKEND_ENDPOINT;
  }
}

export interface NoteInterface {
  name: string;
  owner: string;
  creation: string;
  title: string;
  notify_on_login: number;
  notify_on_every_login: number;
  expire_notification_on: string;
  content: string;
}
