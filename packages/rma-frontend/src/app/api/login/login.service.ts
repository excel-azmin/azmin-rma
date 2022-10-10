import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { share } from 'rxjs/operators';
import { LOGGED_IN } from '../../../app/constants/storage';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private onSubject = new Subject<{ key: string; value: any }>();
  public changes = this.onSubject.asObservable().pipe(share());

  login() {
    this.onSubject.next({ key: LOGGED_IN, value: true });
  }

  logout() {
    this.onSubject.next({ key: LOGGED_IN, value: false });
  }
}
