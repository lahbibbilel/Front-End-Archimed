import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {jwtDecode} from "jwt-decode";
import {Observable} from "rxjs";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) { }


  private authTokenKey = 'authToken';
  private name = 'name';
  private mail = 'email'
  private idkey = '_id'
  private img = 'image'
  private roleKey = 'role'; // Ajoutez cette ligne
  private username = 'username'
  private lastname = 'lastname'

  removeAll()
{
  return this.cookieService.deleteAll()
}
  saveUsername(username: string): void {
    this.cookieService.set(this.username, username);
  }

  getUsername(): any {
    return this.cookieService.get(this.username);
  }


  saveLastname(lastname: string): void {
    this.cookieService.set(this.lastname, lastname);
  }

  getLastname(): any {
    return this.cookieService.get(this.lastname);
  }


  // Ajoutez les méthodes pour sauvegarder et récupérer le rôle
  saveRole(role: string): void {
    this.cookieService.set(this.roleKey, role);
  }

  getRole(): any {
    return this.cookieService.get(this.roleKey);
  }
  saveImage(image: any):void {
    this.cookieService.set(this.img, image);
  }

  getImage(): string | null {
    return  this.cookieService.get('image');
  }

url2 = "http://localhost:3000/user"
  getuser():any
  {
return this.http.get(this.url2)
  }



  saveId(id : any):void
  {
    this.cookieService.set(this.idkey,id)
  }
  getId():string|null
  {
    return  this.cookieService.get('_id')
  }



  saveName(name : string) :void
  {          this.cookieService.set(this.name, name);
  }

  savemail(email : string):void
  {
    this.cookieService.set(this.mail,email)
  }
  getmail():string|null
  {
    return  this.cookieService.get('email')
  }
  getName():string| null
  {
    return  this.cookieService.get('name')
  }

  Url = 'http://localhost:3000';
  login(credentials : {email :any ,password : any}) :any

  {
    return this.http.post(`${this.Url}/user/login`,credentials)
  }

 // saveToken(authToken: string): void {
 //   localStorage.setItem('authToken', authToken);
//  }

 // getToken(): string | null {
//    return localStorage.getItem('authToken');
//  }


// Dans LoginService
//  getUserName(): { name: string } | null {
//    const token = this.getToken();
//    if (token) {
//      const decodedToken = this.decodedToken(token);
 //     if (decodedToken) {
 //       return { name: decodedToken.name };
 //     }
 //   }
 //
 //   return null;
 // }
  isLoginIn():boolean
  {
    return !!this.getToken()
  }
  logout()
  {
    this.cookieService.delete('authToken')
    this.cookieService.delete('image')
    this.cookieService.delete('email')
    this.cookieService.delete('name')
    this.cookieService.delete('_id')
    this.cookieService.delete('lastname')
    this.cookieService.delete('role')
    this.cookieService.delete('username')
  }


  TokenIsExpired(token: any): boolean {
    const decodedToken = this.decodedToken(token);
    if (!decodedToken) {
      return true;
    }

    const currentTimestamp = Math.floor(new Date().getTime() / 1000 / 3600); // Convert current timestamp to hours
    const expirationTimestamp = decodedToken.exp / 3600; // Convert expiration timestamp to hours

    return expirationTimestamp < currentTimestamp;
  }

  decodedToken(token : string) : any
  {
    try {
      return jwtDecode(token)
    }catch (error){
      return null
    }
  }

  saveToken(authToken: string): void {
    this.cookieService.set('authToken', authToken);
  }

  // Utilisez le CookieService pour récupérer le token depuis le cookie
  getToken(): string | null {
    return this.cookieService.get('authToken');
  }

  // Utilisez le CookieService pour supprimer le token du cookie
  removeToken() {
    this.cookieService.delete('authToken');
  }
}
