import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { LoginService } from "../../authentification/login/login.service";

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: { [key: string]: RouteInfo[] } = {
  MANAGER: [
    { path: '/dashboard', title: 'Dashboard', icon: 'fas fa-tachometer-alt', class: '' },
    { path: '/user-profile', title: 'User Profile', icon: 'fas fa-user', class: '' },
   // { path: '/maps', title: 'Maps', icon: 'fas fa-map', class: '' },
   // { path: '/notifications', title: 'Notifications', icon: 'fas fa-bell', class: '' },
    { path: '/calendar-content', title: 'Calendar', icon: 'fas fa-calendar', class: '' },
    { path: '/parametrage-content', title: 'Correspondence Dataflow', icon: 'fas fa-cogs', class: '' },
//    { path: '/calendar-content', title: 'Calendar Content', icon: 'fas fa-calendar', class: '' },

  //  { path: '/chat-content', title: 'Chat Content', icon: 'fas fa-comments', class: '' },
   // { path: '/crud-content', title: 'Crud Users Content', icon: 'fas fa-users-cog', class: '' },
  //  { path: '/home-content', title: 'Home Content', icon: 'fas fa-exchange-alt', class: '' },
 //   { path: '/llama2-content', title: 'Llama2 Content', icon: 'fas fa-robot', class: '' },
  //  { path: '/machine-lerning-content', title: 'Machine Learning Content', icon: 'fas fa-brain', class: '' }
    { path: '/logout', title: 'Logout', icon: 'fas fa-sign-out-alt', class: '' }
  ],
  PSE: [
    { path: '/user-profile', title: 'User Profile', icon: 'fas fa-user', class: '' },
   // { path: '/maps', title: 'Maps', icon: 'fas fa-map', class: '' },
  //  { path: '/notifications', title: 'Notifications', icon: 'fas fa-bell', class: '' },
    { path: '/calendar-content', title: 'Calendar', icon: 'fas fa-calendar', class: '' },
 //   { path: '/chat-content', title: 'Chat Content', icon: 'fas fa-comments', class: '' },
    { path: '/home-content', title: 'Converter', icon: 'fas fa-exchange-alt', class: '' },
 //   { path: '/llama2-content', title: 'Llama2 Content', icon: 'fas fa-robot', class: '' },
 //   { path: '/machine-lerning-content', title: 'Machine Learning Content', icon: 'fas fa-brain', class: '' },
    { path: '/mapping-content', title: 'Generate Pipelines', icon: 'fas fa-project-diagram', class: '' },
    { path: '/logout', title: 'Logout', icon: 'fas fa-sign-out-alt', class: '' }

  ],
  ADMIN: [
    { path: '/user-profile', title: 'User Profile', icon: 'fas fa-user', class: '' },
//    { path: '/notifications', title: 'Notifications', icon: 'fas fa-bell', class: '' },
    { path: '/parametrage-content', title: 'Correspondence Dataflow', icon: 'fas fa-cogs', class: '' },
    { path: '/calendar-content', title: 'Calendar ', icon: 'fas fa-calendar', class: '' },
 //   { path: '/chat-content', title: 'Chat Content', icon: 'fas fa-comments', class: '' },
 //   { path: '/llama2-content', title: 'Llama2 Content', icon: 'fas fa-robot', class: '' }
    { path: '/logout', title: 'Logout', icon: 'fas fa-sign-out-alt', class: '' }

  ]
};

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: RouteInfo[] = [];

  constructor(private http: HttpClient, private loginService: LoginService) { }

  ngOnInit() {
    const userRole = this.loginService.getRole();
    this.menuItems = ROUTES[userRole] || [];
  }

  isMobileMenu() {
    return window.innerWidth <= 991;
  }

}
