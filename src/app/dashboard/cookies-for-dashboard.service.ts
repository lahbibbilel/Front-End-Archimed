import { Injectable } from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CookiesForDashboardService {

  constructor(private http : HttpClient ,private cookiesService : CookieService) { }

  saveNoticesCount(_id: string): void {
    this.cookiesService.set('noticesCount', _id);
  }

  saveManager(_id: string): void {
    this.cookiesService.set('manager', _id);
  }
  // Utilisez le CookieService pour récupérer le token depuis le cookie
  getNoticesCount(): string | null {
    return this.cookiesService.get('noticesCount');
  }
  getManager(): string | null {
    return this.cookiesService.get('manager');
  }

}
