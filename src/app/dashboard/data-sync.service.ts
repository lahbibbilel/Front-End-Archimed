import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSyncService {
  private taskChangeSource = new BehaviorSubject<void>(null);
  taskChanges$ = this.taskChangeSource.asObservable();

  private userChangeSource = new BehaviorSubject<void>(null);
  userChanges$ = this.userChangeSource.asObservable();

  private projectChangeSource = new BehaviorSubject<void>(null);
  projectChanges$ = this.projectChangeSource.asObservable();

  notifyTaskChange() {
    this.taskChangeSource.next();
  }

  notifyUserChange() {
    this.userChangeSource.next();
  }

  notifyProjectChange() {
    this.projectChangeSource.next();
  }


  private facialChangeSource = new BehaviorSubject<void>(null);
  facialChanges$ = this.facialChangeSource.asObservable();

  notifyFacialChange() {
    this.taskChangeSource.next();
  }

}
