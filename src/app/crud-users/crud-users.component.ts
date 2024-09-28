import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UsersCrudService } from "./users-crud.service";
import Swal from "sweetalert2";
import { LoginService } from "../authentification/login/login.service";

@Component({
  selector: 'app-crud-users',
  templateUrl: './crud-users.component.html',
  styleUrls: ['./crud-users.component.css']
})
export class CrudUsersComponent implements OnInit {
  displayedColumns: string[] = ['_id', 'name', 'username', 'lastname', 'email', 'password', 'role', 'actions'];
  users: any[] = [];
  newUser: any = { name: '', username: '', lastname: '', email: '', password: '', role: '' };
  editUser: any = { _id: null, name: '', username: '', lastname: '', email: '', password: '', role: '' };

  constructor(private usersCrudService: UsersCrudService, public getAuth: LoginService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.usersCrudService.getUsers().subscribe(
      data => {
        this.users = data;
      },
      error => {
        console.error('There was an error!', error);
        Swal.fire('Error', 'There was an error fetching the users', 'error');
      }
    );
  }

  openAddUserDialog(): void {
    Swal.fire({
      title: 'Add New User',
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Name">
        <input id="swal-input2" class="swal2-input" placeholder="Username">
        <input id="swal-input3" class="swal2-input" placeholder="Lastname">
        <input id="swal-input4" class="swal2-input" placeholder="Email">
        <input id="swal-input5" class="swal2-input" type="password" placeholder="Password">
        <input id="swal-input6" class="swal2-input" placeholder="Role">
      `,
      preConfirm: () => {
        const name = (document.getElementById('swal-input1') as HTMLInputElement).value;
        const username = (document.getElementById('swal-input2') as HTMLInputElement).value;
        const lastname = (document.getElementById('swal-input3') as HTMLInputElement).value;
        const email = (document.getElementById('swal-input4') as HTMLInputElement).value;
        const password = (document.getElementById('swal-input5') as HTMLInputElement).value;
        const role = (document.getElementById('swal-input6') as HTMLInputElement).value;

        return { name, username, lastname, email, password, role };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.newUser = result.value;
        this.usersCrudService.addUser(this.newUser).subscribe(
          data => {
            this.users.push(data);
            Swal.fire('Success', 'User added successfully', 'success');
            this.newUser = { name: '', username: '', lastname: '', email: '', password: '', role: '' };
          },
          error => {
            console.error('There was an error!', error);
            Swal.fire('Error', 'There was an error adding the user', 'error');
          }
        );
      }
    });
  }

  openEditUserDialog(user: any): void {
    this.editUser = { ...user };  // Properly clone the user object
    Swal.fire({
      title: 'Edit User',
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Name" value="${this.editUser.name}">
        <input id="swal-input2" class="swal2-input" placeholder="Username" value="${this.editUser.username}">
        <input id="swal-input3" class="swal2-input" placeholder="Lastname" value="${this.editUser.lastname}">
        <input id="swal-input4" class="swal2-input" placeholder="Email" value="${this.editUser.email}">
        <input id="swal-input5" class="swal2-input" type="password" placeholder="Password" value="${this.editUser.password}">
        <input id="swal-input6" class="swal2-input" placeholder="Role" value="${this.editUser.role}">
      `,
      preConfirm: () => {
        this.editUser.name = (document.getElementById('swal-input1') as HTMLInputElement).value;
        this.editUser.username = (document.getElementById('swal-input2') as HTMLInputElement).value;
        this.editUser.lastname = (document.getElementById('swal-input3') as HTMLInputElement).value;
        this.editUser.email = (document.getElementById('swal-input4') as HTMLInputElement).value;
        this.editUser.password = (document.getElementById('swal-input5') as HTMLInputElement).value;
        this.editUser.role = (document.getElementById('swal-input6') as HTMLInputElement).value;

        return this.editUser;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateUser(this.editUser._id);
      }
    });
  }

  confirmDeleteUser(id: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteUser(id);
      }
    });
  }

  deleteUser(id: any): void {
    this.usersCrudService.deleteUser(id).subscribe(
      () => {
        this.users = this.users.filter(user => user._id !== id);
        Swal.fire('Success', 'User deleted successfully', 'success');
      },
      error => {
        console.error('There was an error!', error);
        Swal.fire('Error', 'There was an error deleting the user', 'error');
      }
    );
  }

  updateUser(id: any): void {
    this.usersCrudService.updateUser(id, this.editUser).subscribe(
      data => {
        const index = this.users.findIndex(user => user._id === id);
        this.users[index] = data;
        Swal.fire('Success', 'User updated successfully', 'success');
        this.editUser = { _id: null, name: '', username: '', lastname: '', email: '', password: '', role: '' };
      },
      error => {
        console.error('There was an error!', error);
        Swal.fire('Error', 'There was an error updating the user', 'error');
      }
    );
  }
}
