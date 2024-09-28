import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./authentification/login/login.component";
import {SmtpSpringbootComponent} from "./authentification/smtp-springboot/smtp-springboot.component";
import {TestingComponent} from "./testing/testing.component";
import {ChatJSComponent} from "./chat/chat-js/chat-js.component";
import {RegisterComponent} from "./authentification/register/register.component";
import {ParametrageComponent} from "./parametrage/parametrage.component";
import {LoginRegisterFacialSmtpsenderComponent} from "./authentification/login-register-facial-smtpsender/login-register-facial-smtpsender.component";
import {FaceLoginComponent} from "./authentification/face-recognition/face-login/face-login.component";
import {CalendarComponent} from "./calendar/calendar.component";
import {ChatUsersComponent} from "./chat-users/chat-users.component";
import {TemplateFacialComponent} from "./authentification/template-facial/template-facial.component";
import {CallComponent} from "./chat-users/call/call.component";
import {CrudUsersComponent} from "./crud-users/crud-users.component";
import { AuthGuardGuard } from './auth-guard.guard';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ErrorComponent} from "./error/error.component";
import {UpgradeComponent} from "./upgrade/upgrade.component";
import {NotificationsComponent} from "./notifications/notifications.component";
import {MapsComponent} from "./maps/maps.component";
import {IconsComponent} from "./icons/icons.component";
import {ParametrageContentComponent} from "./parametrage-content/parametrage-content.component";
import {TableListComponent} from "./table-list/table-list.component";
import {UserProfileComponent} from "./user-profile/user-profile.component";
import {HeaderComponent} from "./header/header.component";
import {ChatContentComponent} from "./chat-content/chat-content.component";
import {CrudUsersContentComponent} from "./crud-users-content/crud-users-content.component";
import {CalendarContentComponent} from "./calendar-content/calendar-content.component";
import {HomeContentComponent} from "./home-content/home-content.component";
import {Llama2ContentComponent} from "./llama2-content/llama2-content.component";
import {MachineLerningContentComponent} from "./machine-lerning-content/machine-lerning-content.component";
import {MappingComponent} from "./mapping/mapping.component";
import {TasksComponent} from "./tasks/tasks.component";
import {MappingContentComponent} from "./mapping-content/mapping-content.component";
import {LogoutComponent} from "./authentification/logout/logout.component";
import {
  ConverterAndCleanSqlToXmlCsvComponent
} from "./converter-and-clean-sql-to-xml-csv/converter-and-clean-sql-to-xml-csv.component";

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'clean', component: MappingComponent },
  { path: 'clean-sql-to-xmlcsv', component: ConverterAndCleanSqlToXmlCsvComponent },

  { path: 'auth', component: LoginRegisterFacialSmtpsenderComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'testing', component: TestingComponent },
  { path: 'spring', component: SmtpSpringbootComponent },
  { path: 'chat', component: ChatJSComponent },
  { path: 'parametrage', component: ParametrageComponent },
  { path: 'facial', component: FaceLoginComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'facia', component: TemplateFacialComponent },
  { path: 'chating', component: ChatUsersComponent },
  { path: 'crud', component: CrudUsersComponent },
  { path: 'call', component: CallComponent },
  { path: 'tasks', component: TasksComponent },
  { path: 'logout', component: LogoutComponent },
  {path:'ha',component:HeaderComponent},
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardGuard] },
      { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuardGuard] },
      { path: 'table-list', component: TableListComponent, canActivate: [AuthGuardGuard] },
      { path: 'icons', component: IconsComponent, canActivate: [AuthGuardGuard] },
      { path: 'maps', component: MapsComponent, canActivate: [AuthGuardGuard] },
      { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuardGuard] },
      { path: 'upgrade', component: UpgradeComponent, canActivate: [AuthGuardGuard] },
      { path: 'parametrage-content', component: ParametrageContentComponent, canActivate: [AuthGuardGuard] },
      { path: 'mapping-content', component: MappingContentComponent, canActivate: [AuthGuardGuard] },
      { path: 'calendar-content', component: CalendarContentComponent, canActivate: [AuthGuardGuard] },
      { path: 'chat-content', component: ChatContentComponent, canActivate: [AuthGuardGuard] },
      { path: 'crud-content', component: CrudUsersContentComponent, canActivate: [AuthGuardGuard] },
      { path: 'home-content', component: HomeContentComponent, canActivate: [AuthGuardGuard] },
      { path: 'llama2-content', component: Llama2ContentComponent, canActivate: [AuthGuardGuard] },
      { path: 'machine-lerning-content', component: MachineLerningContentComponent, canActivate: [AuthGuardGuard] },

    ]
  },
  { path: '**', component:ErrorComponent } ,
  {path:'da',component:DashboardComponent}
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
})
export class AppRoutingModule { }
