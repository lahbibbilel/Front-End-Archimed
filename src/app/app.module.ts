import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatOptionModule } from "@angular/material/core";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { WebcamModule } from "ngx-webcam";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";

import { HeaderComponent } from "./header/header.component";
import { TestingComponent } from "./testing/testing.component";
import { TestNetComponent } from "./test.net/test.net.component";
import { HomeComponent } from "./home/home.component";
import { ChatJSComponent } from "./chat/chat-js/chat-js.component";
import { RegisterComponent } from "./authentification/register/register.component";
import { ParametrageComponent } from "./parametrage/parametrage.component";
import { SmtpSpringbootComponent } from "./authentification/smtp-springboot/smtp-springboot.component";
import { LoginComponent } from "./authentification/login/login.component";
import { CallComponent } from "./chat-users/call/call.component";
import { CrudUsersComponent } from "./crud-users/crud-users.component";
import { ErrorComponent } from "./error/error.component";
import { TemplateFacialComponent } from "./authentification/template-facial/template-facial.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { LoginRegisterFacialSmtpsenderComponent } from "./authentification/login-register-facial-smtpsender/login-register-facial-smtpsender.component";
import { ChatUsersComponent } from "./chat-users/chat-users.component";
import { FaceLoginComponent } from "./authentification/face-recognition/face-login/face-login.component";
import { FaceRecognitionComponent } from "./authentification/face-recognition/face-recognition.component";
import {FullCalendarModule} from "@fullcalendar/angular";
import {BrowserModule} from "@angular/platform-browser";
import {MatFormFieldModule} from "@angular/material/form-field";
import {NbChatModule, NbLayoutModule, NbThemeModule} from "@nebular/theme";
import {NbEvaIconsModule} from "@nebular/eva-icons";
import { CalendarContentComponent } from './calendar-content/calendar-content.component';
import { MachineLerningContentComponent } from './machine-lerning-content/machine-lerning-content.component';
import { ChatContentComponent } from './chat-content/chat-content.component';
import { Llama2ContentComponent } from './llama2-content/llama2-content.component';
import { CrudUsersContentComponent } from './crud-users-content/crud-users-content.component';
import { HomeContentComponent } from './home-content/home-content.component';
import { MappingContentComponent } from './mapping-content/mapping-content.component';
import { MappingComponent } from './mapping/mapping.component';
import { TasksComponent } from './tasks/tasks.component';
import {MatStepper, MatStepperModule} from "@angular/material/stepper";
import {MatMenuModule} from "@angular/material/menu";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {TratServicesService} from "./services/trat-services.service";
import {NetService} from "./services/.net.service";
import {ConvertdocxService} from "./home/convertdocx.service";
import { LogoutComponent } from './authentification/logout/logout.component';
import {NgxPaginationModule} from "ngx-pagination";
import { FilterPipe } from './filter.pipe';
import { EmailBreakPipe } from './email-break.pipe';
import { ConverterAndCleanSqlToXmlCsvComponent } from './converter-and-clean-sql-to-xml-csv/converter-and-clean-sql-to-xml-csv.component';
import { ConverterAndCleanSqlToXmlCsvContentComponent } from './converter-and-clean-sql-to-xml-csv-content/converter-and-clean-sql-to-xml-csv-content.component';
import { SeparatePipe } from './separate.pipe';
import { BuildDistComponent } from './build-dist/build-dist.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    NgbModule,
    ToastrModule.forRoot(),
    MatMenuModule,
    NgxPaginationModule,


    BrowserModule,
    ReactiveFormsModule,

    // Angular Material Modules
    MatSlideToggleModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    // Third-party Modules
    WebcamModule,

    NbThemeModule.forRoot({name: 'default'}),
    NbLayoutModule,
    NbEvaIconsModule,
    NbChatModule,
    FullCalendarModule,
    MatStepperModule,
    MatMenuModule,
    MatSnackBarModule,



  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    HeaderComponent,
    HomeComponent,
    TestNetComponent,
    TestingComponent,
    LoginComponent,
    SmtpSpringbootComponent,
    ChatJSComponent,
    RegisterComponent,
    ParametrageComponent,
    FaceRecognitionComponent,
    FaceLoginComponent,
    ChatUsersComponent,
    LoginRegisterFacialSmtpsenderComponent,
    CalendarComponent,
    TemplateFacialComponent,
    ErrorComponent,
    CrudUsersComponent,
    CallComponent,
    CalendarContentComponent,
    MachineLerningContentComponent,
    ChatContentComponent,
    Llama2ContentComponent,
    CrudUsersContentComponent,
    HomeContentComponent,
    MappingContentComponent,
    MappingComponent,
    TasksComponent,
    LogoutComponent,
    FilterPipe,
    EmailBreakPipe,
    ConverterAndCleanSqlToXmlCsvComponent,
    ConverterAndCleanSqlToXmlCsvContentComponent,
    SeparatePipe,
    BuildDistComponent,
  ],
  providers: [
    TratServicesService,
    NetService,
    ConvertdocxService
  ],
  exports: [
    ParametrageComponent,
    EmailBreakPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
