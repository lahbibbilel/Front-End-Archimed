import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Socket} from "ngx-socket-io";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:3001';
  private apiUsers = 'http://localhost:3000/user';
private socket! : Socket
  constructor(private http: HttpClient) { }
getUsers():Observable<any> {
  return this.http.get(this.apiUsers)
}
getUserById(id : any) : Observable<any>
{
  return this.http.get(this.apiUsers,id)
}
  // Méthode pour envoyer un message
  sendMessage(senderId: string, receiverId: string, message: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/send-message`, { senderId, receiverId, message });
  }


  listenForMessages(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('receiveMessage', (newMessage: any) => {
        observer.next(newMessage);
      });
    });
  }


getMessagesUser(senderId: string, receiverId: string): Observable<any> {
  return this.http.get<any>(`http://localhost:3001/messages/${senderId}/${receiverId}`);
}
  // Méthode pour récupérer tous les messages
  getMessages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/messages`);
  }
}
