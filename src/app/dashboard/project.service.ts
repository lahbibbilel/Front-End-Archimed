import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";
import {DataSyncService} from "./data-sync.service";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private baseUrl = 'http://localhost:3000/project';
  constructor(private http: HttpClient,private dataSync: DataSyncService) {}

  getProjects(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  addProject(project : any) : Observable<any> {
    return this.http.post(this.baseUrl,project).pipe(
      tap(() => this.dataSync.notifyProjectChange())
    );
  }
  updateProject(_id : any,user : any) :Observable<any>   {
return  this.http.put(`${this.baseUrl}/${_id}` , user).pipe(
  tap(() => this.dataSync.notifyProjectChange()) // Notify task changes
);
  }  deleteProject(_id : any) : Observable<any>{
    return this.http.delete(`${this.baseUrl}/${_id}`).pipe(
      tap(() => this.dataSync.notifyProjectChange()) // Notify task changes
    );
  }
  private url = "http://localhost:3000/user"
  getManagerById(_id : any) : Observable<any>
  {
    return this.http.get(`${this.url}/${_id}`)
  }

  getProjectByName(name: string): Observable<any> {
    return this.http.get(`http://localhost:3000/project/byName/${name}`).pipe(
      tap(() => this.dataSync.notifyTaskChange()) // Notify task changes
    );
  }

}
