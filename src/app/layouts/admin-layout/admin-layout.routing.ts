import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { ParametrageContentComponent } from '../../parametrage-content/parametrage-content.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { AuthGuardGuard } from '../../auth-guard.guard';
import {CalendarContentComponent} from "../../calendar-content/calendar-content.component";
import {ChatContentComponent} from "../../chat-content/chat-content.component";
import {CrudUsersContentComponent} from "../../crud-users-content/crud-users-content.component";
import {HomeContentComponent} from "../../home-content/home-content.component";
import {Llama2ContentComponent} from "../../llama2-content/llama2-content.component";
import {MachineLerningContentComponent} from "../../machine-lerning-content/machine-lerning-content.component"; // Assurez-vous d'importer le garde

export const AdminLayoutRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardGuard] },
  { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuardGuard] },
  { path: 'table-list', component: TableListComponent, canActivate: [AuthGuardGuard] },
  { path: 'icons', component: IconsComponent, canActivate: [AuthGuardGuard] },
  { path: 'maps', component: MapsComponent, canActivate: [AuthGuardGuard] },
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuardGuard] },
  { path: 'upgrade', component: UpgradeComponent, canActivate: [AuthGuardGuard] },
  { path: 'parametrage-content', component: ParametrageContentComponent, canActivate: [AuthGuardGuard] },
  { path: 'mapping-content', component: CalendarContentComponent, canActivate: [AuthGuardGuard] },
  { path: 'calendar-content', component: CalendarContentComponent, canActivate: [AuthGuardGuard] },
  { path: 'chat-content', component: ChatContentComponent, canActivate: [AuthGuardGuard] },
  { path: 'crud-content', component: CrudUsersContentComponent, canActivate: [AuthGuardGuard] },
  { path: 'home-content', component: HomeContentComponent, canActivate: [AuthGuardGuard] },
  { path: 'llama2-content', component: Llama2ContentComponent, canActivate: [AuthGuardGuard] },
  { path: 'machine-lerning-content', component: MachineLerningContentComponent, canActivate: [AuthGuardGuard] },

];
