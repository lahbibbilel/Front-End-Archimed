import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { LoginService } from "../authentification/login/login.service";
import { UsersCrudService } from "../crud-users/users-crud.service";
import Swal from "sweetalert2";
import { UserAuthService } from "../header/user-auth.service";
import { DomSanitizer } from "@angular/platform-browser";
import {DataSyncService} from "../dashboard/data-sync.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  name: string | undefined;
  image: any;
  ImageAuth: string | null = null;
  test: any;
  username: any;
  lastname: any;
  email: any;
  role: any;
  id: any;
  password: any;
  isLoading = false;

  constructor(
    public serviceAuth: LoginService,
    public sanitizer: DomSanitizer,
    public user: UsersCrudService,
    private userService: UserAuthService,
    private employeesService: UsersCrudService,
    private tokenService: LoginService,
    private cdr: ChangeDetectorRef,
    private dataSyncService: DataSyncService,   ) { }
  ngOnInit() {
    this.id = this.tokenService.getId();
    this.user.getById(this.id).subscribe(
      (response: any) => {
        this.username = response.username;
        this.email = response.email;
        this.role = response.role;
        this.name = response.name;
        this.lastname = response.lastname;
        this.password = response.password;
        this.ImageAuth = response.image; // Ensure image is assigned here
        this.cdr.detectChanges(); // Trigger change detection
      }

    );

    // Another subscription for user data
    this.userService.getUsers().subscribe(
      (response) => {
        this.test = response;
        const user = this.test.find(item => item.name === this.name);
        if (user) {
          this.ImageAuth = user.image;
          console.log("Image found:", this.ImageAuth);
          this.cdr.detectChanges();  // Force change detection after updating image
        } else {
          console.error('User image not found');
        }
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
    this.loadUserData();

    // Écoute les changements d'utilisateur
    this.dataSyncService.userChanges$.subscribe(() => {
      console.log('Changement détecté, rechargement des données utilisateur');
      this.loadUserData();  // Recharge les données
    });
  }

  loadUserData() {
    this.employeesService.getById(this.id).subscribe(
      (response: any) => {
        this.username = response.username;
        this.email = response.email;
        this.name = response.name;
        this.lastname = response.lastname;
        this.password = response.password;
        this.ImageAuth = response.image;
        this.cdr.detectChanges();  // Mise à jour de l'interface utilisateur
      }
    );
  }


  changeProfilePicture(event: Event): void {
    this.isLoading = true;
    this.cdr.detectChanges();  // Forcer la détection des changements

    const userId = this.serviceAuth.getId();

    if (!userId) {
      console.error("Impossible de récupérer l'identifiant de l'utilisateur");
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) {
      console.error('Aucun fichier sélectionné');
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('image', file);

    this.userService.updateProfilePicture(userId, file).subscribe(
      (response) => {
        console.log('Photo de profil mise à jour avec succès', response);
        Swal.fire('Succès', 'Votre photo de profil a été mise à jour avec succès !', 'success');
        this.ImageAuth = response.image; // Update the image
        this.isLoading = false;
        this.cdr.detectChanges(); // Trigger change detection to update UI
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de l\'image de profil : ', error);
        Swal.fire('Erreur', 'Une erreur s\'est produite lors de la mise à jour de votre photo de profil.', 'error');
        this.isLoading = false;
        this.cdr.detectChanges(); // Trigger change detection to update UI
      }
    );
  }


  editUser(user: any) {
    Swal.fire({
      title: 'Edit User',
      html: `
    <div style="max-height: 400px; overflow-y: auto;">
      <label for="username">Username :</label>
      <input id="username" class="swal2-input" placeholder="Username" value="${user.username}">

      <label for="name">Firstname :</label>
      <input id="name" class="swal2-input" placeholder="Firstname" value="${user.name}">

      <label for="lastname">Lastname :</label>
      <input id="lastname" class="swal2-input" placeholder="Lastname" value="${user.lastname}">

        <label for="password">Current password:</label>
        <br>
        <input id="password" class="swal2-input"  placeholder="Ancien Password" value="${user.confirmPassword}" disabled>
        <br>
        <label for="newPassword">New Password:</label>
        <input id="newPassword" class="swal2-input" placeholder="Nouveau Password">
        <br>
        <label for="confirmNewPassword">Confirm New Password:</label>
        <input id="confirmNewPassword" class="swal2-input" placeholder="Confirmer Nouveau Password">



    </div>
    `,



      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Exit',
      preConfirm: () => {
        // Get input values safely
        const username = (document.getElementById('username') as HTMLInputElement)?.value;
        const name = (document.getElementById('name') as HTMLInputElement)?.value;
        const lastname = (document.getElementById('lastname') as HTMLInputElement)?.value;
        const email = (document.getElementById('email') as HTMLInputElement)?.value;
        const password = (document.getElementById('password') as HTMLInputElement)?.value;

        // Check if all required fields are filled
        if (!username || !name || !lastname || !password) {
          Swal.showValidationMessage('Please fill all fields');
          return;
        }

        // Return updated user object
        return {
          id: user.id,
          username,
          name,
          lastname,
          email,
          password
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedUser = result.value;
        this.employeesService.updateUser(updatedUser.id, updatedUser).toPromise()
          .then(() => {
            Swal.fire('Success', 'User updated successfully!', 'success');
          })
          .catch((error) => {
            console.error('Error updating user:', error);
            Swal.fire('Error', 'Failed to update user', 'error');
          });
      }
    });
  }
}
