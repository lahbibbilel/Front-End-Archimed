import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChatJSmlService {
  private apiUrl = 'http://localhost:4000'; // Votre URL API Express

  constructor(private http: HttpClient) { }

  predictCategory(message: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/predict`, { message });
  }
  private url = "http://localhost:3005/lahbibChat"
  // Méthode pour envoyer le message à l'API lahbibChat
  ChatLahbib(message: string): Observable<any> {
    return this.http.post<any>(this.url, { content: message });
  }

}
