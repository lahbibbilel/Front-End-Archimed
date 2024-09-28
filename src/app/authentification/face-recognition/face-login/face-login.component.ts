import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Subject } from 'rxjs';
import { AuthService } from '../auth.service';
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { LoginService } from "../../login/login.service";

@Component({
  selector: 'app-face-login',
  templateUrl: './face-login.component.html',
  styleUrls: ['./face-login.component.css']
})
export class FaceLoginComponent implements OnInit {

  public showWebcam = true;
  public allowCameraSwitch = true;
  public deviceId: string | undefined;
  public videoOptions: MediaTrackConstraints = {};
  public errors: WebcamInitError[] = [];
  private trigger: Subject<void> = new Subject<void>();
  public isAuthenticated: boolean = false;
  public capturedImage: WebcamImage | null = null;
  public isLoading: boolean = false;  // Loading state
  @Output() open: EventEmitter<any> = new EventEmitter();

  public buttonLabel: string = 'Close Webcam';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {}

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
    if (!this.showWebcam) {
      this.capturedImage = null;  // Clear the captured image when closing the webcam
    }
    this.updateButtonLabel();
  }

  public updateButtonLabel(): void {
    this.buttonLabel = this.showWebcam ? 'Close Webcam' : 'Open Webcam';
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.capturedImage = webcamImage; // Store the captured image
    this.showWebcam = false; // Stop the webcam
    this.isLoading = true; // Start the loading animation

    const imageBase64 = webcamImage.imageAsDataUrl;
    const imageBlob = this.dataURLToBlob(imageBase64);
    const formData = new FormData();
    formData.append('image', imageBlob, 'image.png');
    this.authService.authenticateWithFace(formData).subscribe(
      (response: any) => {
        this.isLoading = false; // Stop the loading animation

        if (response && response.authToken) {
          // Handle successful authentication
          this.handleSuccessfulAuthentication(response);
        } else {
          this.toastr.error('Authentication failed');
        }
      },
      (error: any) => {
        this.isLoading = false; // Stop the loading animation
        this.toastr.error('Erreur de connexion !');
        console.error('Error during face login:', error);
      }
    );
  }

  private handleSuccessfulAuthentication(response: any): void {
    const authToken = response.authToken;
    const name = response.user.name;
    const mail = response.user.email;
    const key = response.user._id;
    const img = response.user.image;
    const role = response.user.role; // Correction : Utiliser `response.user.role`

    this.loginService.saveImage(img);
    this.loginService.saveToken(authToken);
    this.loginService.saveName(name);
    this.loginService.savemail(mail);
    this.loginService.saveId(key);
    this.loginService.saveRole(role);

    this.isAuthenticated = true;

    if (role === 'MANAGER') {
      this.router.navigateByUrl('/dashboard');
      this.toastr.success('Connexion réussie !');
    } else if (role === 'PSE' || role === 'ADMIN') {
      this.router.navigateByUrl('/user-profile');
      this.toastr.success('Connexion réussie !');
    } else {
      this.toastr.error('Face Not Exist !');
    }
  }

// Gestion des erreurs
  catch (error: any) {
    console.error('Error during login:', error);
    this.toastr.error('Face Not Exist  !');
  }

  private dataURLToBlob(dataURL: string): Blob {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('Active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public get triggerObservable(): Subject<void> {
    return this.trigger;
  }
}
