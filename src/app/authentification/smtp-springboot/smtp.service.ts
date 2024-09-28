import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SmtpService {

  private apiUrl = 'http://localhost:8181/api/send-email'; // Mettez votre URL d'API SMTP ici
  private nodeUrl = 'http://localhost:3000/send-email-user-add'; // Mettez votre URL d'API SMTP ici

  constructor(private http: HttpClient) { }

  sendEmail(emailData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, emailData);
  }
  sendEmailAddUser(emailData: any): Observable<any> {
    return this.http.post<any>(this.nodeUrl, emailData);
  }
}
