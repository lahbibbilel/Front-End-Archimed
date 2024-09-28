import { Component, OnInit } from '@angular/core';
import {WebcamImage, WebcamInitError} from "ngx-webcam";
import {Subject} from "rxjs";
import {AuthService} from "../face-recognition/auth.service";

@Component({
  selector: 'app-template-facial',
  templateUrl: './template-facial.component.html',
  styleUrls: ['./template-facial.component.css']
})
export class TemplateFacialComponent implements OnInit {
showFacial = false;
showHello = false;
showRegister = false;
  constructor(private authService: AuthService) { }

  ngOnInit(): void { }
  toggleFacial() {
    this.showHello = !this.showHello;
    this.showRegister = false;
    this.showFacial = false; // Ensure facial form is hidden when toggling between sign-in and sign-up
    const main = document.querySelector('main');
    if (main) {
      main.classList.toggle('facial', this.showHello);
    }
  }

}
