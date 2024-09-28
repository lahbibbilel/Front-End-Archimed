import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {DataSyncService} from "../dashboard/data-sync.service";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
apiUrl = 'http://localhost:3000/calendar';

  constructor(private http: HttpClient ,private dataSync: DataSyncService) { }

  getCalendars(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  addTaskCalendar(tasks : any)
    :Observable<any> {
    return this.http.post(this.apiUrl, tasks).pipe(
      tap(() => this.dataSync.notifyTaskChange()) // Notify task changes
    );
  }
  deleteTask(_id : any): Observable<any>
  {
    return this.http.delete(`${this.apiUrl}/${_id}`).pipe(
      tap(() => this.dataSync.notifyTaskChange()) // Notify task changes
    );}
  updateTask(_id : any, user : any) :Observable<any>
  {
    return this.http.put(`${this.apiUrl}/${_id}` , user).pipe(
      tap(() => this.dataSync.notifyTaskChange()) // Notify task changes
    );}
getTaskById(_id : any ) : Observable<any>
{
  return this.http.get(`${this.apiUrl}/${_id}`)
}

  getTasksByUserId(userId: string) {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }


  markTaskAsFinished(taskId: string, dateFinished: Date, userId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${taskId}/finish`, { dateFinished, userId });
  }

}
