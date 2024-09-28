import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {LoginService} from "./login.service";
import {ToastrService} from "ngx-toastr";
import {SmtpService} from "../smtp-springboot/smtp.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials = { email: '', password: '' };
  showSuccess = false;
  showError = false;
  showRegister!: boolean;

  constructor(
    private emailService: SmtpService,
    private route: Router,
    private http: HttpClient,
    private service: LoginService,
    private toastr: ToastrService  ) { }

  ngOnInit(): void {
    this.service.removeToken();
  }

  login() {
    this.service.login(this.credentials).subscribe(
      (response: any) => {
        if (response && response.authTokens) {
          const authToken = response.authTokens[0].authToken;
          const name = response.name;
          const mail = response.email;
          const key = response._id;
          const img = response.image;
          const role = response.role;

          this.service.saveImage(img);
          this.service.saveToken(authToken);
          this.service.saveName(name);
          this.service.savemail(mail);
          this.service.saveId(key);

          if (role === 'USER') {
            this.route.navigateByUrl('/home');
          } else {
            console.log("ok");
          }

          this.toastr.success('Connexion réussie !'); // Afficher une notification de succès
          this.showSuccess = true;
          this.showError = false;
        } else {
          this.showError = true;
          this.showSuccess = false;
        }
      },
      (error: any) => {
        this.toastr.error('Erreur de connexion !'); // Afficher une notification d'erreur
        this.showError = true;
        this.showSuccess = false;
      }
    );
  }
}
