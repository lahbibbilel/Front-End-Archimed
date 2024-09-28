import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import Swal from 'sweetalert2';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {LoginService} from "../authentification/login/login.service";
import {DomSanitizer} from "@angular/platform-browser";
import {AuthService} from "../authentification/face-recognition/auth.service";
import {UserAuthService} from "./user-auth.service";
import {jwtDecode} from "jwt-decode";

declare var $: any; // Déclarer jQuery pour pouvoir l'utiliser dans votre composant

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  form: FormGroup;
  skeletonJson: any;
  users: any;
  authenticatedUser: any;
  loading: boolean = true;
  error: string | null = null;


  constructor(private formBuilder: FormBuilder, private http: HttpClient
    , private toastr: ToastrService
    , public sanitizer: DomSanitizer, private tokenService: LoginService, private userService: UserAuthService
  ) {
    this.form = this.formBuilder.group({
      inputs: this.formBuilder.array([]) // Initialisez le tableau vide
    });
  }

  NameAuth! : any

  @Input()   EmailAuth! : any
  ImageAuth: string | null = null;
test! : any


  ngOnInit(): void {

    const sideLinks = document.querySelectorAll('.sidebar .logo .side-menu li a:not(.logout)');

    sideLinks.forEach(item => {
      const li = item.parentElement;
      item.addEventListener('click', () => {
        sideLinks.forEach(i => {
          i.parentElement?.classList.remove('active'); // Ajouter une vérification de nullité
        })
        li?.classList.add('active'); // Ajouter une vérification de nullité
      })
    });

    const menuBar = document.querySelector('.content nav .bx.bx-menu');
    const sideBar = document.querySelector('.sidebar');

    if (menuBar instanceof HTMLElement && sideBar instanceof HTMLElement) { // Vérifier si les éléments sont des instances de HTMLElement
      menuBar.addEventListener('click', () => {
        sideBar.classList.toggle('close'); // sideBar est garanti non null ici
      });
    }

    const searchBtn = document.querySelector('.content nav form .form-input button');
    const searchBtnIcon = document.querySelector('.content nav form .form-input button .bx');
    const searchForm = document.querySelector('.content nav form');

    if (searchBtn instanceof HTMLElement && searchBtnIcon instanceof HTMLElement && searchForm instanceof HTMLElement) { // Vérifier si les éléments sont des instances de HTMLElement
      searchBtn.addEventListener('click', function (e) {
        if (window.innerWidth < 576) {
          e.preventDefault;
          searchForm.classList.toggle('show');
          if (searchForm.classList.contains('show')) {
            searchBtnIcon.classList.replace('bx-search', 'bx-x');
          } else {
            searchBtnIcon.classList.replace('bx-x', 'bx-search');
          }
        }
      });
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth < 768) {
        sideBar?.classList.add('close'); // Ajouter une vérification de nullité
      } else {
        sideBar?.classList.remove('close'); // Ajouter une vérification de nullité
      }
      if (window.innerWidth > 576) {
        searchBtnIcon?.classList.replace('bx-x', 'bx-search'); // Ajouter une vérification de nullité
        searchForm?.classList.remove('show'); // Ajouter une vérification de nullité
      }
    });

    const toggler = document.getElementById('theme-toggle');

    if (toggler instanceof HTMLInputElement) { // Vérifier si l'élément est une instance de HTMLInputElement
      toggler.addEventListener('change', function () {
        if (this.checked) {
          document.body.classList.add('dark');
        } else {
          document.body.classList.remove('dark');
        }
      });
    }


    this.NameAuth = this.tokenService.getName();
    this.EmailAuth = this.tokenService.getmail();
   /* this.ImageAuth = this.tokenService.getImage(); */

    this.userService.getUsers().subscribe(
      (response) => {
        this.test = response;
        console.log(this.test, 'here');
        for (let item of this.test) {
          if (item.name === this.NameAuth) {
            console.log(item.name, 'here 2 ');
            console.log(item.image, 'here 2 ');
          /*  return item.name; */
           this.ImageAuth = item.image
          } else {
            console.log('error 2');
          }

      }
  /*      console.log(this.tokenService.getImage()); */
      }
    );






  }

  isDropdownOpen: boolean = false;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  createInput(): FormGroup {
    return this.formBuilder.group({
      key: '',
      value: ''
    });
  }

  get inputs(): FormArray {
    return this.form.get('inputs') as FormArray;
  }

  addInput(): void {
    this.inputs.push(this.createInput()); // Ajoutez un nouveau champ avec des champs vides
  }

  openMapping(): void {
    const self = this; // Capturer la référence à la classe pour l'utiliser dans la fonction de callback
    const mixin = Swal.mixin({
      html: `
      <div id="content">
        <table class="table">
          <thead>
            <tr>
              <th>Sql</th>
              <th>unimarc 21</th>
            </tr>
          </thead>
          <tbody id="inputRows">

          </tbody>

        </table>
      </div>
      <button id="addButton" class="btn btn-primary mb-2"><i class="fas fa-plus"></i></button>
      <button id="closeButton" class="btn btn-secondary mb-2"><i class="fas fa-times"></i></button>
      <button id="saveButton" class="btn btn-success mb-2"><i class="fas fa-save"></i> Enregistrer</button>
      <button id="editButton" class="btn btn-info mb-2"><i class="fas fa-edit"></i> Modifier</button>
    `,
      didOpen: () => {
        const addButton = document.getElementById('addButton');
        const saveButton = document.getElementById('saveButton');
        const editButton = document.getElementById('editButton'); // Sélectionner le bouton Modifier
        addButton?.addEventListener('click', () => {
          self.addInputRow(); // Appel de la méthode pour ajouter une nouvelle rangée
        });
        saveButton?.addEventListener('click', () => {
          self.saveData(); // Appel de la méthode pour enregistrer les données
        });
        editButton?.addEventListener('click', () => {
          self.editData(); // Appel de la méthode pour éditer les données
        });
        this.addInputRow(); // Ajouter la première rangée
      }
    });

    mixin.fire({
      width: 'auto' // Ajuster la largeur automatiquement
    });
  }

  editData(): void {
    const fileName = prompt('Entrez le nom du fichier JSON à éditer :');
    if (fileName) {
      this.http.get<any>(`http://localhost:3001/filesJson/${fileName}.json`).subscribe(
        (data: any) => {
          this.skeletonJson = data;
          const jsonData = JSON.stringify(this.skeletonJson, null, 2); // Convertir l'objet JSON en chaîne JSON
          Swal.fire({
            title: 'Modifier le fichier JSON',
            input: 'textarea',
            inputValue: jsonData,
            inputAttributes: {
              autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Enregistrer',
            showLoaderOnConfirm: true,
            preConfirm: (editedJson) => {
              try {
                const parsedJson = JSON.parse(editedJson);
                this.skeletonJson = parsedJson;
                return parsedJson;
              } catch (error) {
                Swal.showValidationMessage(`Erreur de syntaxe JSON: ${error}`);
              }
            },
            allowOutsideClick: () => !Swal.isLoading()
          }).then((result) => {
            if (result.isConfirmed) {
              // Convertir l'objet JSON modifié en chaîne JSON avant de l'envoyer
              const modifiedJsonData = JSON.stringify(this.skeletonJson, null, 2);
              this.http.post<any>('http://localhost:3001/saveJson', {jsonData: modifiedJsonData}).subscribe(
                (response) => {
                  Swal.fire({
                    title: 'Enregistré!',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                  });
                },
                (error) => {
                  console.error('Erreur lors de l\'enregistrement du fichier JSON : ', error);
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Erreur lors de l\'enregistrement du fichier JSON!',
                  });
                }
              );
            }
          });
        },
        (error) => {
          console.error('Erreur lors du chargement du fichier JSON : ', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Erreur lors du chargement du fichier JSON!',
          });
        }
      );
    }
  }

  addInputRow(): void {
    const inputRows = document.getElementById('inputRows');
    if (inputRows) {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td><input type="text" placeholder="Enter key"></td>
        <td><input type="text" placeholder="Enter value"></td>
      `;
      inputRows.appendChild(newRow);
    }
  }

  saveData(): void {
    const inputsData: { key: string, value: string }[] = [];
    const inputRows = document.querySelectorAll('#inputRows tr');
    inputRows.forEach((row: any) => {
      const keyInput = row.querySelector('input[type="text"][placeholder="Enter key"]');
      const valueInput = row.querySelector('input[type="text"][placeholder="Enter value"]');
      if (keyInput && valueInput) {
        const key = keyInput.value.trim();
        const value = valueInput.value.trim();
        if (key !== '' && value !== '') {
          inputsData.push({key, value});
        }
      }
    });

    const skeletonJson: any = {
      "Plugins": [""],
      "Sources": [
        {
          "BlockGuid": "",
          "Parameters": {
            "filePath": "",
            "nodeName": "",
            "shouldProcessMessageLambdaString": ""
          },
          "Faulted": [],
          "Next": [
            {
              "BlockGuid": "",
              "Parameters": {
                "lambda": ""
              },
              "Faulted": [],
              "Next": [
                {
                  "BlockGuid": "",
                  "Parameters": {
                    "baseName": "",
                    "mapping": {},
                    "metadataMapping": [
                      {
                        "AlexandrieNature": "",
                        "AlexandrieType": "",
                        "SyracuseFormat": "",
                        "SyracuseType": ""
                      }
                    ]
                  },
                  "Faulted": [],
                  "Next": [
                    {
                      "BlockGuid": "",
                      "Parameters": {
                        "lambda": ""
                      },
                      "Faulted": [],
                      "Next": [
                        {
                          "BlockGuid": "",
                          "Parameters": {
                            "sqliteDbPath": "",
                            "mapping": {},
                            "preloadedEntries": {}
                          },
                          "Faulted": [],
                          "Next": [
                            {
                              "BlockGuid": "",
                              "Parameters": {
                                "cleanupRecords": {},
                                "mergedFields": []
                              },
                              "Faulted": [],
                              "Next": [
                                {
                                  "BlockGuid": "",
                                  "Parameters": {},
                                  "Faulted": [],
                                  "Next": [
                                    {
                                      "BlockGuid": "",
                                      "Parameters": {
                                        "dbPath": ""
                                      },
                                      "LocalDisabled": false,
                                      "Faulted": [],
                                      "Next": []
                                    },
                                    {
                                      "BlockGuid": "",
                                      "Parameters": {
                                        "dbPath": ""
                                      },
                                      "Faulted": [],
                                      "Next": []
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  "BlockGuid": "",
                  "Parameters": {},
                  "LocalDisabled": false,
                  "Faulted": [],
                  "Next": [
                    {
                      "BlockGuid": "",
                      "Parameters": {
                        "path": ""
                      },
                      "Faulted": [],
                      "Next": []
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      "Faulted": [],
      "Next": []
    };

    // Incorporer les données d'entrée dans la section de mapping du squelette JSON
    const mappingSection = skeletonJson.Sources[0].Next[0].Next[0].Parameters.mapping;
    inputsData.forEach(data => {
      mappingSection[data.key] = data.value;
    });

    const jsonData = JSON.stringify(skeletonJson, null, 2);

    // Enregistrer le fichier JSON sur le serveur
    this.http.post<any>('http://localhost:3001/saveJson', {jsonData}).subscribe((response) => {
      console.log('Fichier JSON enregistré avec succès : ', response);
    }, (error) => {
      console.error('Erreur lors de l\'enregistrement du fichier JSON : ', error);
    });
  }

  sidenavWidth: string = '0';

  openNav(): void {
    this.sidenavWidth = '180px';
  }

  closeNav(): void {
    this.sidenavWidth = '0';
  }

  openCleaner(): void {
    const self = this; // Capturer la référence à la classe pour l'utiliser dans la fonction de callback
    const mixin = Swal.mixin({
      html: `
        <div id="content">
          Voulez-vous vraiment générer les fichiers CSV et XML ?
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    });

    mixin.fire().then((result) => {
      if (result.isConfirmed) {
        // L'utilisateur a confirmé, appeler l'API pour générer les fichiers CSV et XML
        this.generateFiles();
      }
    });
  }

  generateFiles(): void {
    this.http.get('http://localhost:5000/items/mapping').subscribe(
      (response) => {
        console.log('Fichiers générés avec succès !', response);
        // Afficher une alerte ou un message de succès ici si nécessaire
      },
      (error) => {
        console.error('Erreur lors de la génération des fichiers', error);
        // Afficher une alerte ou un message d'erreur ici si nécessaire
      }
    );
  }

  showSucc() {
    this.toastr.success('Hello world!', 'Toastr fun!');
  }
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

}
