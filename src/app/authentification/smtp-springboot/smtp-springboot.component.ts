import { Component, OnInit } from '@angular/core';
import {SmtpService} from "./smtp.service";

@Component({
  selector: 'app-smtp-springboot',
  templateUrl: './smtp-springboot.component.html',
  styleUrls: ['./smtp-springboot.component.css']
})
export class SmtpSpringbootComponent implements OnInit {
  ngOnInit(): void {
  }

  constructor(private emailService: SmtpService) { }

  sendEmail() {
    const emailData = {

      subject: 'Test',
      text: 'This is a test email',
      html: '<p>This is a <b>test</b> email</p>',
      dest: ['bile789456123@gmail.com'],
      ccs: [],
      from: 'lahbibbilel07@gmail.com'


    };

    this.emailService.sendEmail(emailData).subscribe(
      response => {
        console.log('Email sent successfully!', response);
      },
      error => {
        console.error('Failed to send email:', error);
      }
    );
  }

}
