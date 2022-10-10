import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ACCESS_TOKEN,
  ACCESS_TOKEN_EXPIRY,
  EXPIRES_IN,
  STATE,
  LOGGED_IN,
  SCOPE,
} from '../constants/storage';
import { StorageService } from '../api/storage/storage.service';
import { LoginService } from '../api/login/login.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.page.html',
  styleUrls: ['./callback.page.scss'],
})
export class CallbackPage implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storage: StorageService,
    private login: LoginService,
  ) {}

  ngOnInit() {
    const home = 'home';
    this.route.fragment.subscribe((fragment: string) => {
      const query = new URLSearchParams(fragment);
      const respState = query.get(STATE);

      this.storage.getItem(STATE).then(state => {
        this.storage.removeItem(STATE).then();
        if (state === respState) {
          const now = Math.floor(Date.now() / 1000);
          this.storage
            .setItem(ACCESS_TOKEN, query.get(ACCESS_TOKEN))
            .then(() =>
              this.storage.setItem(
                ACCESS_TOKEN_EXPIRY,
                (now + Number(query.get(EXPIRES_IN))).toString(),
              ),
            )
            .then(() => this.storage.setItem(SCOPE, query.get(SCOPE)))
            .then(() => this.storage.setItem(LOGGED_IN, true))
            .then(() => this.login.login())
            .then(() => this.router.navigateByUrl(home));
        } else {
          this.router.navigateByUrl(home);
        }
      });
    });
  }
}
