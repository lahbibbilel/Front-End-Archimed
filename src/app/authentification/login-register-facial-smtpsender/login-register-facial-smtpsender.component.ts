import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../login/login.service';
import { ToastrService } from 'ngx-toastr';
import { RegisterService } from '../register/register.service';
import { SmtpService } from '../smtp-springboot/smtp.service';

@Component({
  selector: 'app-login-register-facial-smtpsender',
  templateUrl: './login-register-facial-smtpsender.component.html',
  styleUrls: ['./login-register-facial-smtpsender.component.css']
})
export class LoginRegisterFacialSmtpsenderComponent implements OnInit {
  credentials = { email: '', password: '' };
  signUpData = { name: '', username: '', lastname: '', email: '', password: '' };
  showRegister = false;
  showFacial = false;
  showHello = false;
passwordField :string = 'password'
  toggleIcon :string = 'fa-eye'

  showPassword() : void
  {
    this.passwordField = this.passwordField ==='password' ? 'text' : 'password' ;
this.toggleIcon = this.toggleIcon === 'password' ? 'fa-eye' : 'fa-eye-slash'
  }
  user = {
    name: '',
    username: '',
    lastname: '',
    email: '',
    password: ''
  };



  constructor(
    private router: Router,
    private http: HttpClient,
    private loginService: LoginService,
    private registerService: RegisterService,
    private emailService: SmtpService,
    private toastr: ToastrService
  ) { }

  img : any
  ngOnInit(): void {
    this.loginService.removeToken();
   // this.loginService.saveImage()
 //   console.log(this.loginService.getImage(),'image testing here');
  }

  toggleHello() {
    this.showHello = !this.showHello;
    this.showFacial = false;
    this.showRegister = false;  // Ensure register form is hidden when toggling hello form
  }
  affichage ! :any;

  login() {
    this.loginService.login(this.credentials).subscribe(
      (response: any) => {
        if (response && response.authToken) {
          this.handleLoginSuccess(response);
        } else {
          this.toastr.error('Erreur de connexion !');
        }
      },
      (error: any) => {
        console.error('Error during login:', error);
        this.toastr.error('Erreur de connexion !');
      }
    );
  }

  handleLoginSuccess(response: any) {
    const authToken = response.authToken;
    const name = response.name;
    const mail = response.email;
    const key = response._id;
    const img = response.image;
    const role = response.role;
    const lastname = response.lastname;
    const username = response.username;

    this.loginService.saveToken(authToken);
    this.loginService.saveName(name);
    this.loginService.savemail(mail);
    this.loginService.saveId(key);
    this.loginService.saveRole(role);
    this.loginService.saveUsername(username);
    this.loginService.saveLastname(lastname);
    this.loginService.saveImage(img);

    this.affichage = role;
    if (role === 'MANAGER') {
      this.router.navigateByUrl('/dashboard');
      this.toastr.success('Connexion réussie !');
    } else if (role === 'PSE') {
      this.router.navigateByUrl('/user-profile');
      this.toastr.success('Connexion réussie !');
    } else {
      this.toastr.error('Erreur de connexion !');
    }
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

  signUp() {
    // Send registration data to the service
    this.registerService.createUser(this.user).subscribe(
      (response: any) => {
        console.log('User registered successfully:', response);
        this.toastr.success('User registered successfully!');
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
        this.toastr.error('Error registering user!');
      }
    );
  }

  signInWithFacial() {
    // Implement facial recognition logic here
    // For now, let's just simulate a successful login with a console log
    console.log('Facial recognition sign in successful!');
    this.toastr.success('Facial recognition sign in successful!');
    // Redirect to the home page or any other logic
    this.router.navigateByUrl('/user-profile');
  }




  toggleForm() {
    this.showRegister = !this.showRegister;
 this.showHello = false;
    this.showFacial = false; // Ensure facial form is hidden when toggling between sign-in and sign-up
    const main = document.querySelector('main');
    if (main) {
      main.classList.toggle('sign-up-mode', this.showRegister);
    }
  }

  toggleFacial() {
    this.showFacial = !this.showFacial;
    this.showHello = false;
    this.showRegister = false; // Ensure register form is hidden when toggling facial form
    const main = document.querySelector('main');
    if (main) {
      main.classList.toggle('sign-up-mode', this.showFacial);
    }
  }

  resetForm() {
    this.signUpData = { name: '', username: '', lastname: '', email: '', password: '' };
  }

  moveSlider(event: any) {
    const index = event.target.dataset.value;

    const currentImage = document.querySelector(`.img-${index}`);
    const images = document.querySelectorAll('.image');
    images.forEach((img) => img.classList.remove('show'));
    currentImage?.classList.add('show');

    const textSlider = document.querySelector('.text-group') as HTMLElement;
    if (textSlider) {
      textSlider.style.transform = `translateY(${-(index - 1) * 2.2}rem)`;
    }

    const bullets = document.querySelectorAll('.bullets span');
    bullets.forEach((bull) => bull.classList.remove('active'));
    event.target.classList.add('active');
  }

  passwordVisible: boolean = false;
  passwordFieldType: string = 'password';

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    this.passwordFieldType = this.passwordVisible ? 'text' : 'password';
  }
}
