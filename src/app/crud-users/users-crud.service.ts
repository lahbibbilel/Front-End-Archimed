import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map, tap} from "rxjs/operators";
import {DataSyncService} from "../dashboard/data-sync.service";

@Injectable({
  providedIn: 'root'
})
export class UsersCrudService {
  url = 'http://localhost:3000/user'
  constructor(private http : HttpClient,private dataSync: DataSyncService) { }

  ngOnInit(): void {
  }
  getUsers() : Observable<any> {
    return this.http.get<any>(this.url);
  }
  addUser(user : any) : Observable<any> {
    return this.http.post(this.url, user).pipe(
      tap(() => this.dataSync.notifyUserChange())
    );
  }
  deleteUser(id: any): Observable<any> {
    return this.http.delete(`${this.url}/${id}`).pipe(
      tap(() => this.dataSync.notifyUserChange())
    );
  }
  updateUser(_id: any, user: any): Observable<any> {
    return this.http.put(`${this.url}/${_id}`, user).pipe(
      tap(() => this.dataSync.notifyUserChange())
    );
  }
  getById(_id : any) : Observable<any>
  {
    return this.http.get(`${this.url}/${_id}`)
  }

  addUserWithFace(formData: FormData): Observable<any> {
    return this.http.post('http://localhost:5000/user/register-face', formData).pipe(
      tap(()=>this.dataSync.notifyFacialChange())

    )
  }

  checkUserExists(name: string, username: string, lastname: string, email: string): Observable<any> {
    return this.http.post<{ name: boolean, username: boolean, lastname: boolean, email: boolean, password: boolean, messages: string[] }>(
      'http://localhost:5000/check-user-exists',
      {name, username, lastname, email}
    );
  }
}
