import { Component, OnInit } from '@angular/core';
import {RegisterService} from "./register.service";
import {ToastrService} from "ngx-toastr";
import {SmtpService} from "../smtp-springboot/smtp.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user = {
    name: '',
    username: '',
    lastname: '',
    email: '',
    password: ''
  };

  constructor(private toaster: ToastrService, private registerService: RegisterService, private emailService: SmtpService) { }

  ngOnInit(): void {
  }
  sendEmail() {
    const emailData = {
      subject: 'Welcome to our platform!',
      text: `Dear ${this.user.name},\n\nThank you for registering with us.`,
      html: `<p>Dear ${this.user.name},</p><p>Thank you for registering with us.</p>`,
      dest: [this.user.email],
      ccs: [],
      from: 'lahbibbilel07@gmail.com'
    };

    // Send a POST request to the backend
    this.emailService.sendEmail(emailData).subscribe(
      () => {
        console.log('Email sent successfully!');
      },
      (error) => {
        console.error('Failed to send email:', error);
      }
    );
  }


  onSubmit() {
    // Send registration data to the service
    this.registerService.createUser(this.user)
      .subscribe(
        (response: any) => {
          console.log('User registered successfully:', response);
          this.toaster.success('User registered successfully!');
          this.sendEmail(); // Call sendEmail method after successful registration
          // Reset the form after successful registration
          this.user = {
            name: '',
            username: '',
            lastname: '',
            email: '',
            password: ''
          };
        },
        (error: any) => {
          console.error('Error registering user:', error);
          this.toaster.error('Error registering user!');
        }
      );
  }
}
