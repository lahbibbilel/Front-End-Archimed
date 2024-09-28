import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MappingService } from './mapping.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProjectService} from "../dashboard/project.service";
import Swal from "sweetalert2";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss']
})
export class MappingComponent implements OnInit {
  @ViewChild('content', { static: false }) content: ElementRef;
  @ViewChild('contentXml', { static: false }) contentXml: ElementRef;

  public projectsTable: any[] = [];
  outputPath: string = '';
  selectedAttributes: string[] = [];
  selectedFormat: string = '';
  selectedProject: string = '';

  jugementAttributes: string[] = [
    'Id', 'idcateg', 'cod', 'niv', 'num', 'numeb', 'numess', 'numta3', 'cer', 'cereb',
    'dateent', 'darefin', 'nat', 'sujet1', 'sujet3', 'req', 'def', 'moukarir',
    'dateihalamoukarir', 'mandoub', 'dateihalamandoub', 'maal', 'mabda', 'mabdaimportant',
    'cle', 'cause', 'avoca', 'hok', 'source', 'dateap', 'taw', 'taw1', 'lien1', 'lien2',
    'lien11', 'liennotes', 'liennotesg', 'txt', 'majalla', 'fasslmajalla', 'dateinsertiondb',
    'addedby', 'pub', 'datemodification', 'modifiedby'
  ];








  constructor(private xmlService: MappingService,private fb: FormBuilder
  ,private projectsService : ProjectService,private http : HttpClient,
              private toaster : ToastrService

  ) { }
  csvForm: FormGroup;
  isSelected(attribute: string): boolean {
    return this.selectedAttributes.includes(attribute);
  }


  selectAllAttributes(): void {
    this.selectedAttributes = [...this.jugementAttributes];
  }

  resetAttributes(): void {
    this.selectedAttributes = [];
  }
  toggleAttribute(attribute: string): void {
    const index = this.selectedAttributes.indexOf(attribute);
    if (index === -1) {
      this.selectedAttributes.push(attribute);
    } else {
      this.selectedAttributes.splice(index, 1);
    }
  }

  onSubmit(): void {
    if (this.csvForm.valid) {
      const request = {
        outputPathCsv: this.csvForm.value.outputPathCsv,
        delimiter: this.csvForm.value.delimiter,
        selectedAttributes: this.selectedAttributes
      };

      this.xmlService.generateCsv(request).subscribe(
        (response) => {
          console.log('CSV generated successfully', response);
          this.toaster.success('CSV generated successfully');
        },
        (error) => {
          console.error('Error generating CSV', error);
          this.toaster.error('Error generating CSV');
        }
      );
    } else {
      console.error('Output path and selected attributes are required.');
   //   this.toaster.warning('Output path and delimiter are required.');
    }
  }
  ngOnInit(): void {
    this.csvForm = this.fb.group({
      outputPathCsv: ['', Validators.required],
      delimiter: [';', Validators.required] // Champ pour spécifier le délimiteur
    });
  this.fetchProjects()
  }


  fetchProjects() {
    this.projectsService.getProjects().subscribe(
      (response: any) => {
        this.projectsTable = response;
      },
      (error: any) => {
        console.log('You have a problem', error);
      }
    );
  }



  generateXml() {
    if (this.outputPath && this.selectedAttributes.length > 0) {
      this.xmlService.generateXml(this.outputPath, this.selectedAttributes)
        .subscribe(
          response => {
            console.log('XML generated successfully:', response);
           this.toaster.success('XML generated successfully')
            // Handle success message or redirect to download link
          },
          error => {
            console.error('Error generating XML:', error);
          this.toaster.error('Error generating XML')
            // Handle error message
          }
        );
    } else {
      console.error('Output path and selected attributes are required.');
      this.toaster.warning("Output path and selected attributes are required.")
      // Handle validation error message
    }
  }

  /*toggleAttribute(attribute: string) {
    const index = this.selectedAttributes.indexOf(attribute);
    if (index === -1) {
      this.selectedAttributes.push(attribute);
    } else {
      this.selectedAttributes.splice(index, 1);
    }
  }

  isSelected(attribute: string): boolean {
    return this.selectedAttributes.includes(attribute);
  }
*/


  openMapping() {
    const self = this; // Capturer la référence à la classe pour l'utiliser dans la fonction de callback
    const mixin = Swal.mixin({
      html: `
    <div id="content" style="max-height: 400px; overflow-y: auto;">
      <table class="table">
        <thead>
          <tr>
            <th>Field</th>
            <th>Mapping to Syracus</th>
            <th></th> <!-- Colonne pour les actions -->
          </tr>
        </thead>
        <tbody id="inputRows"></tbody>
      </table>
    </div>
    <div id="buttons" style="display: flex; justify-content: space-between; margin-top: 10px;">
      <button id="addButton" class="btn btn-primary"><i class="fas fa-plus"></i> Add</button>
      <button id="saveButton" class="btn btn-success"><i class="fas fa-save"></i> Save</button>
      <button id="editButton" class="btn btn-info"><i class="fas fa-edit"></i> Edit</button>
      <button id="closeButton" class="btn btn-secondary"><i class="fas fa-times"></i> Close</button>
    </div>
  `,
      showConfirmButton: false, // Désactive le bouton "OK"
      showCancelButton: false,  // Désactive le bouton "Cancel" si nécessaire
      didOpen: () => {
        const addButton = document.getElementById('addButton');
        const saveButton = document.getElementById('saveButton');
        const editButton = document.getElementById('editButton');
        const closeButton = document.getElementById('closeButton');

        addButton?.addEventListener('click', () => {
          self.addInputRow(); // Appel de la méthode pour ajouter une nouvelle rangée
        });
        saveButton?.addEventListener('click', () => {
          self.saveData(); // Appel de la méthode pour enregistrer les données
        });
        editButton?.addEventListener('click', () => {
          self.editData(); // Appel de la méthode pour éditer les données
        });
        closeButton?.addEventListener('click', () => {
          Swal.close(); // Fermer la fenêtre modale
        });

        this.addInputRow(); // Ajouter la première rangée
      }
    });

    mixin.fire({
      width: 'auto' // Ajuster la largeur automatiquement
    });
  }

// Méthode pour ajouter une nouvelle rangée avec un bouton de suppression
  addInputRow() {
    const inputRows = document.getElementById('inputRows');
    const row = document.createElement('tr');
    row.innerHTML = `
    <td><input type="text" name="field" /></td>
    <td><input type="text" name="mapping" /></td>
    <td><button class="btn btn-danger remove-row"><i class="fas fa-times"></i></button></td>
  `;
    inputRows?.appendChild(row);

    // Ajouter un événement pour supprimer la rangée lorsqu'on clique sur le bouton
    row.querySelector('.remove-row')?.addEventListener('click', () => {
      row.remove();
    });
  }


  editData() {
    const fileName = 'data.json'; // Nom du fichier à éditer directement
    this.http.get<any>(`http://localhost:3001/filesJson/${fileName}`).subscribe(
      (data: any) => {
        const jsonData = JSON.stringify(data, null, 2); // Convertir l'objet JSON en chaîne JSON
        Swal.fire({
          title: 'Edit pipeline Form',
          input: 'textarea',
          inputValue: jsonData,
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Save',
          showLoaderOnConfirm: true,
          width: '50vw', // Augmenter la largeur de la fenêtre

          inputPlaceholder: 'Edit your JSON data here...',
          preConfirm: (editedJson) => {
            try {
              const parsedJson = JSON.parse(editedJson);
              return parsedJson;
            } catch (error) {
              Swal.showValidationMessage(`Erreur de syntaxe JSON: ${error}`);
            }
          },
          allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
          if (result.isConfirmed) {
            // Convertir l'objet JSON modifié en chaîne JSON avant de l'envoyer
            const modifiedJsonData = JSON.stringify(result.value, null, 2);
            this.http.post<any>('http://localhost:3001/saveJson', { jsonData: modifiedJsonData }).subscribe(
              (response) => {
                Swal.fire({
                  title: 'Enregistré!',
                  text: 'Les modifications ont été enregistrées avec succès.',
                  icon: 'success',
                  width: '40vw', // Ajuster la largeur pour le message de confirmation
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
                  width: '40vw', // Ajuster la largeur pour le message d'erreur
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
          width: '40vw', // Ajuster la largeur pour le message d'erreur
        });
      }
    );
  }

  saveData() {
    const inputsData: { key: string, value: string }[] = [];
    const inputRows = document.querySelectorAll('#inputRows tr');

    inputRows.forEach((row: any) => {
      const keyInput = row.querySelector('input[name="field"]');
      const valueInput = row.querySelector('input[name="mapping"]');

      if (keyInput && valueInput) {
        const key = keyInput.value.trim();
        const value = valueInput.value.trim();

        if (key !== '' && value !== '') {
          inputsData.push({ key, value });

          // Debugging: Log to ensure that key and value are being correctly captured
          console.log("Captured Input - Key:", key, "Value:", value);
        }
      }
    });

    // Creating the base JSON structure for the pipeline
    const skeletonJson: any = {
      "Plugins": [
        "C:\\Users\\lahbi\\Downloads\\Archimed.SyracuseDataFlow\\Archimed.SyracuseDataFlow\\ExternalPlugins\\AlexandriePlugins\\bin\\Debug\\net6.0\\AlexandriePlugins.dll"
      ],
      "Sources": [
        {
          "BlockGuid": "12e4b545-fa3b-4e51-aaff-31ff36050c9c",
          "Parameters": {
            "filePath": "C:\\Users\\lahbi\\OneDrive\\Bureau\\jugement-output\\14-03.xml",
            "nodeName": "record",
            "shouldProcessMessageLambdaString": ""
          },
          "Faulted": [],
          "Next": [
            {
              "BlockGuid": "bd9efd84-a7ed-4ead-b778-d1719344e625",
              "Parameters": {
                "lambda": "m => {\r\n\r\n// On fixe l'attribut id\r\nm.Value.SetAttributeValue(\"id\", m.Value.XPathSelectElement(\"field[@id='id']\")?.Value);\r\nXElement element = new XElement(\"recordtype\");\r\n\r\nstring code = \"jugement\";\r\nXAttribute attribute = new XAttribute(\"code\", code);\r\nelement.Add(attribute);\r\nelement.Value = \"jugement\";\r\n\r\nm.Value.Add(element);\r\n}"
              },
              "Faulted": [],
              "Next": [
                {
                  "BlockGuid": "d974c08b-5a4a-464b-b7bb-505205bbc3e8",
                  "Parameters": {
                    "baseName": "TRAT",
                    "mapping": {},
                    "metadataMapping": [
                      {
                        "AlexandrieNature": null,
                        "AlexandrieType": "jugement",
                        "SyracuseFormat": "UNI",
                        "SyracuseType": "JUGEMENT"
                      }
                    ]
                  },
                  "Faulted": [],
                  "Next": []
                }
              ]
            }
          ]
        }
      ]
    };

    // Ensure that the mapping object is initialized
    if (!skeletonJson.Sources[0].Next[0].Next[0].Parameters.mapping) {
      skeletonJson.Sources[0].Next[0].Next[0].Parameters.mapping = {};
    }

    // Populate the mapping object with inputs
    inputsData.forEach(input => {
      skeletonJson.Sources[0].Next[0].Next[0].Parameters.mapping[input.key] = input.value;

      // Debugging: Ensure the mapping is updated correctly
      console.log("Updated Mapping - Key:", input.key, "Value:", input.value);
    });

    // Final debugging before saving
    console.log("Final JSON Object:", JSON.stringify(skeletonJson, null, 2));

    // Save the data using an HTTP POST request
    this.http.post<any>('http://localhost:3001/saveJson', { jsonData: JSON.stringify(skeletonJson) }).subscribe(
      (response) => {
        console.log('Fichier .pipeline enregistré avec succès');

        // Download the .pipeline file
        const blob = new Blob([JSON.stringify(skeletonJson, null, 2)], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'trat.pipeline';
        link.click();
        URL.revokeObjectURL(link.href);

        Swal.fire({
          title: 'Enregistré!',
          text: 'Le fichier JSON a été enregistré et le fichier .pipeline a été téléchargé.',
          icon: 'success',
          timer: 3000,
          showConfirmButton: false
        });
      },
      (error) => {
        console.error('Erreur lors de l\'enregistrement du fichier JSON : ', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `Erreur lors de l'enregistrement du fichier JSON: ${error.message}`,
        });
      }
    );
  }
}
