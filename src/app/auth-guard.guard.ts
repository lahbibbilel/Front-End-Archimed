import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {LoginService} from "./authentification/login/login.service";
import {AuthService} from "./authentification/face-recognition/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {

  constructor(private authservice : LoginService,private router : Router , private face : AuthService) {

  }

  canActivate(): boolean {
    if (this.authservice.isLoginIn() || this.face.isAuthenticated)
    {
      return true
    }
    else {
      this.router.navigate(['/auth'])
      return false
    }
  }

}

