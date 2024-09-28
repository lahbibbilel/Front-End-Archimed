import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000'; // Votre URL de l'API
  public isAuthenticated: boolean = false;

  constructor(private http: HttpClient) { }

  authenticateWithFace(imageData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/login-face`, imageData).pipe(
      tap(response => {
        if (response && response.authTokens) {
          this.isAuthenticated = true;
        }
      })
    );
  }
}

