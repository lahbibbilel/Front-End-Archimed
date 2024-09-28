import { Injectable } from '@angular/core';
import {LoginService} from "../login/login.service";

@Injectable({
  providedIn: 'root'
})
export class LogoutServiceService {

  constructor(public login : LoginService) { }
  logout()
  {
this.login.removeAll()
  }
}
