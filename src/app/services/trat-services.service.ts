import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TratServicesService {
  private baseUrl = 'http://localhost:3001/documents/';


  private apiUrl = 'http://localhost:5000/items/mapping';



  constructor(private http : HttpClient) {

  }

    getNotices(): Observable<any> {
    return this.http.get(this.baseUrl, { responseType: 'text' });
  }
  generateFiles(): Observable<any> {
    return this.http.get(`${this.apiUrl}`,{ responseType: 'text' });
  }

}
