import {Component, OnInit, ElementRef, Input} from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { Router } from '@angular/router';
import Chart from 'chart.js';
import {DomSanitizer} from "@angular/platform-browser";
import {LoginService} from "../../authentification/login/login.service";
import {UserAuthService} from "../../header/user-auth.service";
import Swal from "sweetalert2";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    private listTitles: any[];
    location: Location;
      mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;

    public isCollapsed = true;

  NameAuth! : any

  @Input()   EmailAuth! : any
  ImageAuth: string | null = null;
  test! : any

    constructor(location: Location,  private element: ElementRef, private router: Router,
       public sanitizer: DomSanitizer, private tokenService: LoginService, private userService: UserAuthService,
                public cookieService : CookieService

    ) {
      this.location = location;
          this.sidebarVisible = false;
    }








  ngOnInit() {
    this.NameAuth = this.tokenService.getName();
    this.EmailAuth = this.tokenService.getmail();

    console.log("Name from TokenService: ", this.NameAuth);

    this.userService.getUsers().subscribe(
      (response) => {
        this.test = response;
        this.ImageAuth = response.image; // Ensure image is assigned here

        console.log(this.test, 'User data received');

        const user = this.test.find(item => item.name === this.NameAuth);
        if (user) {
          console.log('Found user:', user);
          this.ImageAuth = user.image;
        } else {
          console.error('User not found');
        }
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

    collapse(){
      this.isCollapsed = !this.isCollapsed;
      const navbar = document.getElementsByTagName('nav')[0];
      console.log(navbar);
      if (!this.isCollapsed) {
        navbar.classList.remove('navbar-transparent');
        navbar.classList.add('bg-white');
      }else{
        navbar.classList.add('navbar-transparent');
        navbar.classList.remove('bg-white');
      }

    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
        const html = document.getElementsByTagName('html')[0];
        if (window.innerWidth < 991) {
          mainPanel.style.position = 'fixed';
        }

        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);

        html.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const html = document.getElementsByTagName('html')[0];
        this.toggleButton.classList.remove('toggled');
        const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];

        if (window.innerWidth < 991) {
          setTimeout(function(){
            mainPanel.style.position = '';
          }, 500);
        }
        this.sidebarVisible = false;
        html.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const html = document.getElementsByTagName('html')[0];
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
        const html = document.getElementsByTagName('html')[0];

        if (this.mobile_menu_visible == 1) {
            // $('html').removeClass('nav-open');
            html.classList.remove('nav-open');
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function() {
                $toggle.classList.remove('toggled');
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function() {
                $toggle.classList.add('toggled');
            }, 430);

            var $layer = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (html.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            }else if (html.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }

            setTimeout(function() {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = function() { //asign a function
              html.classList.remove('nav-open');
              this.mobile_menu_visible = 0;
              $layer.classList.remove('visible');
              setTimeout(function() {
                  $layer.remove();
                  $toggle.classList.remove('toggled');
              }, 400);
            }.bind(this);

            html.classList.add('nav-open');
            this.mobile_menu_visible = 1;

        }
    };
/*
    getTitle(){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      if(titlee.charAt(0) === '#'){
          titlee = titlee.slice( 2 );
      }
      titlee = titlee.split('/').pop();

      for(var item = 0; item < this.listTitles.length; item++){
          if(this.listTitles[item].path === titlee){
              return this.listTitles[item].title;
          }
      }
      return 'Dashboard';
    }
*/
  changeProfilePicture(event: Event): void {
    const userId = this.tokenService.getId();

    // Vérification de null
    if (!userId) {
      console.error("Impossible de récupérer l'identifiant de l'utilisateur");
      return;
    }

    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) {
      console.error('Aucun fichier sélectionné');
      return;
    }

    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('image', file);

    this.userService.updateProfilePicture(userId, file).subscribe(
      (response) => {
        console.log('Photo de profil mise à jour avec succès', response);
        Swal.fire('Succès', 'Votre photo de profil a été mise à jour avec succès !', 'success');
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de l\'image de profil : ', error);
        Swal.fire('Erreur', 'Une erreur s\'est produite lors de la mise à jour de votre photo de profil.', 'error');
      }
    );
  }

  logout() {
      this.cookieService.delete('authToken');
      this.cookieService.delete('image');
      this.cookieService.delete('email');
      this.cookieService.delete('name');
      this.cookieService.delete('_id');
      this.cookieService.delete('lastname');
      this.cookieService.delete('role');
      this.cookieService.delete('username');

      // Optionally, delete cookies from all paths, especially if they were set with paths
      this.cookieService.deleteAll();
  this.router.navigate(['/auth'])
   }
}
