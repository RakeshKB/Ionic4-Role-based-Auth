import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CanActivate } from '@angular/router';
import { take, map } from 'rxjs/operators'
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

  constructor(private router: Router, private auth: AuthService, private alertCtrl: AlertController) {}
  canActivate(route: ActivatedRouteSnapshot) {
    const expectedRole = route.data.role;
    console.log("expectedRole", expectedRole);
    return this.auth.user.pipe(
      take(1),
      map(user => {
        console.log("Log", JSON.stringify(user));
        if(user){
          console.log("User is present");
          let role = user['role'];
          if(role == expectedRole){
            return true;
          }else{
            this.showAlert();
            return this.router.parseUrl('/login');
          }
        }else{
          this.showAlert();
          return this.router.parseUrl('/login');
        }
      })
    )
  }

  async showAlert() {
    let alert = await this.alertCtrl.create({
      header: 'Unauthorised',
      message: 'Sorry, you do not have permission to access this page',
      buttons: ['OK']
    });
    alert.present();
  }
}
