import { Component, OnInit, HostListener } from '@angular/core';
import { interval, Subscription, of, throwError, timer, from } from 'rxjs';
import {
  TOKEN,
  ACCESS_TOKEN,
  STATE,
  CALLBACK_ENDPOINT,
  SILENT_REFRESH_ENDPOINT,
  ACCESS_TOKEN_EXPIRY,
  EXPIRES_IN,
  TEN_MINUTES_IN_MS,
  SCOPES_OPENID_ALL,
  TWENTY_MINUTES_IN_SECONDS,
  LOGGED_IN,
  ALL_TERRITORIES,
  WARRANTY_APP_URL,
  AUTH_SERVER_URL,
} from './constants/storage';
import { AppService } from './app.service';
import { LoginService } from './api/login/login.service';
import { USER_ROLE, TERRITORY, WAREHOUSES } from './constants/app-string';
import { SettingsService } from './common/services/settings/settings.service';
import { switchMap, retry, delay } from 'rxjs/operators';
import { PermissionManager } from './api/permission/permission.service';
import { PERMISSION_STATE } from './constants/permission-roles';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  loggedIn: boolean = false;
  hideAuthButtons: boolean = false;
  permissionState: any = PERMISSION_STATE;
  subscription: Subscription;
  isSettingMenuVisible: boolean = false;
  isSalesMenuVisible: boolean = false;
  isStockMenuVisible: boolean = false;
  isRelayMenuVisible: boolean = false;
  countDown: Subscription;
  counter = 0;
  tick = 1000;

  fullName: string = '';
  imageURL: string = '';
  authServerUrl = '';

  constructor(
    private readonly appService: AppService,
    private readonly loginService: LoginService,
    private readonly settingService: SettingsService,
    private readonly permissionManager: PermissionManager,
  ) {}

  @HostListener('window:message', ['$event'])
  onMessage(event) {
    if (event && event.data && typeof event.data === 'string') {
      const hash = event.data.replace('#', '');
      const query = new URLSearchParams(hash);
      const now = Math.floor(Date.now() / 1000);
      this.appService
        .getStorage()
        .setItem(ACCESS_TOKEN, query.get(ACCESS_TOKEN))
        .then(token => this.checkRoles(token))
        .then(() => {
          return this.appService
            .getStorage()
            .setItem(
              ACCESS_TOKEN_EXPIRY,
              (now + Number(query.get(EXPIRES_IN))).toString(),
            );
        })
        .then(saved => {
          this.startTimer();
          this.loginService.login();
        });
    }
  }

  startTimer() {
    this.appService
      .getStorage()
      .getItem(ACCESS_TOKEN_EXPIRY)
      .then(item => {
        this.counter =
          Number(item) -
          Math.floor(Date.now() / 1000) -
          TEN_MINUTES_IN_MS / 500;
      });
  }

  ngOnInit() {
    this.setUserSession();
    this.setupSilentRefresh();
    this.appService.getGlobalDefault();
    this.permissionManager.setupPermissions();
    this.countDown = timer(0, this.tick).subscribe(() => --this.counter);
  }

  setUserSession() {
    this.startTimer();
    this.loginService.changes.subscribe({
      next: event => {
        if (event.key === LOGGED_IN && event.value === true) {
          this.loggedIn = true;
          this.checkRolesAndLoadProfileWithToken();
        } else {
          this.loggedIn = false;
        }
      },
      error: error => {},
    });

    if (location.hash.includes(ACCESS_TOKEN)) {
      const hash = (location.hash as string).replace('#', '');
      const query = new URLSearchParams(hash);
      const token = query.get(ACCESS_TOKEN);
      this.checkRoles(token);
      this.loadProfile(token);
    } else {
      this.checkRolesAndLoadProfileWithToken();
    }
  }

  checkRolesAndLoadProfileWithToken() {
    this.appService
      .getStorage()
      .getItem(ACCESS_TOKEN)
      .then(token => {
        this.checkRoles(token);
        this.loadProfile(token);
      });
  }

  loadProfile(token: string) {
    this.appService.loadProfile(token).subscribe({
      error: error => {
        this.loggedIn = false;
        this.appService.setupImplicitFlow();
      },
      next: profile => {
        this.loggedIn = true;
        this.fullName = profile.name;
        this.imageURL = profile.picture;
        this.startTimer();
      },
    });
  }

  checkRoles(token: string) {
    this.settingService
      .checkUserProfile(token)
      .pipe(
        switchMap((data: any) => {
          if (data && data.roles && data.roles.length === 0) {
            return of({}).pipe(
              delay(500),
              switchMap(obj => {
                return throwError(data);
              }),
            );
          }
          return of(data);
        }),
        retry(6),
      )
      .subscribe({
        next: (res: {
          roles?: string[];
          warehouses: string[];
          territory: string[];
        }) => {
          this.startTimer();
          this.loggedIn = true;
          if (res) {
            this.appService.getStorage().setItem(USER_ROLE, res.roles || []);
            this.appService
              .getStorage()
              .setItem(WAREHOUSES, res.warehouses || []);
            const filtered_territory = res?.territory?.filter(
              territory => territory !== ALL_TERRITORIES,
            );
            this.appService
              .getStorage()
              .setItem(TERRITORY, filtered_territory || []);
          }
        },
        error: error => {},
      });
  }

  setupSilentRefresh() {
    const source = interval(TEN_MINUTES_IN_MS);
    this.subscription = source.subscribe(val => this.silentRefresh());
  }

  login() {
    this.appService.setupImplicitFlow();
  }

  logout() {
    from(this.appService.getStorage().getItem(AUTH_SERVER_URL))
      .pipe(
        switchMap(url => {
          this.authServerUrl = url;
          return from(this.appService.getStorage().clear());
        }),
      )
      .subscribe({
        next: success => {
          this.loggedIn = false;
          window.location.href = this.authServerUrl + '?cmd=web_logout';
        },
        error: error => {},
      });
  }

  silentRefresh() {
    const now = Math.floor(Date.now() / 1000);
    this.appService
      .getStorage()
      .getItem(ACCESS_TOKEN_EXPIRY)
      .then(tokenExpiry => {
        const expiry = tokenExpiry ? Number(tokenExpiry) : now;
        if (now > expiry - TWENTY_MINUTES_IN_SECONDS) {
          this.appService.getMessage().subscribe({
            next: response => {
              if (!response) return;
              const frappe_auth_config = {
                client_id: response.frontendClientId,
                redirect_uri: response.posAppURL + SILENT_REFRESH_ENDPOINT,
                response_type: TOKEN,
                scope: SCOPES_OPENID_ALL,
              };

              const state = this.appService.generateRandomString(32);
              this.appService
                .getStorage()
                .setItem(STATE, state)
                .then(savedState => {
                  const url = this.appService
                    .getEncodedFrappeLoginUrl(
                      response.authorizationURL,
                      frappe_auth_config,
                      savedState,
                    )
                    .replace(/^http:\/\//i, 'https://');

                  const existingIframe = document.getElementsByClassName(
                    'silent-iframe',
                  );

                  if (!existingIframe.length) {
                    const iframe = document.createElement('iframe');
                    iframe.onload = () => {
                      try {
                        (iframe.contentWindow || iframe.contentDocument)
                          .location.href;
                      } catch (err) {
                        this.appService
                          .getStorage()
                          .clear()
                          .then(() =>
                            this.appService.initiateLogin(
                              response.authorizationURL,
                              {
                                ...frappe_auth_config,
                                ...{
                                  redirect_uri:
                                    response.posAppURL + CALLBACK_ENDPOINT,
                                },
                              },
                            ),
                          );
                      }
                    };
                    iframe.className = 'silent-iframe';
                    iframe.setAttribute('src', url);

                    iframe.style.display = 'none';
                    document.body.appendChild(iframe);
                  } else {
                    existingIframe[0].setAttribute('src', url);
                  }
                });
            },
            error: error => {},
          });
        }
      });
  }

  openWarrantyApp() {
    this.appService
      .getStorage()
      .getItem(WARRANTY_APP_URL)
      .then(warrantyUrl => {
        window.open(warrantyUrl, '_blank');
      });
  }

  openSerialSearch() {
    this.appService
      .getStorage()
      .getItem(WARRANTY_APP_URL)
      .then(warrantyUrl => {
        window.open(`${warrantyUrl}/serial-search`, '_blank');
      });
  }

  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe();
  }
}
