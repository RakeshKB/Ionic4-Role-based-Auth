import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Storage } from '@ionic/storage'
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';

const TOKEN_KEY = 'user-access-token';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<any>;
  private authState = new BehaviorSubject(null);
  constructor(private storage: Storage, private router: Router) {
    this.loadUser();
    this.user = this.authState.asObservable().pipe(
      filter(response => response) 
      //Returns responses that are not null. This is used for AuthGuard as canActivate will get null response since we have kept authState = new BehaviorSubject(null);
      //Simply put AuthGuard will wait for loadUser() to get called and check if there is any user. Hence we return user in IF condition and empty email and role in ELSE condition
    );
  }

  loadUser() {
    this.storage.get(TOKEN_KEY).then(data => {
      if(data && data.email && data.role){
        this.authState.next(data);
      }else{
        this.authState.next({email: null, role: null});
      }
    })
  }

  signIn(credentials): Observable<any> {
    let email = credentials.email;
    let password = credentials.password;
    let user = null;

    if (email === 'admin' && password === 'admin') {
      user = { email, role: 'ADMIN' };
    } else if (email === 'user' && password === 'user') {
      user = { email, role: 'USER' };
    }
    this.authState.next(user);
    this.storage.set(TOKEN_KEY, user);

    return of(user);
  }

  async signOut() {
    await this.storage.set(TOKEN_KEY, null);
    this.authState.next(null);
    this.router.navigateByUrl('/login');
  }
}
