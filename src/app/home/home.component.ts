import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { TratServicesService } from "../services/trat-services.service";
import { NetService } from "../services/.net.service";
import { ConvertdocxService } from "./convertdocx.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { MatStepper } from "@angular/material/stepper";
import { ProjectService } from "../dashboard/project.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @ViewChild('stepper') private stepper: MatStepper;
  @ViewChild('carouselTemplate') private carouselTemplate: any; // Typo correction
//here

  jugements: any[] = [];
  totalItems: number = 0;
  pageNumber: number = 1;
  pageSize: number = 100;

  //end
  input: string = '';
  conversionSuccess = false;
  generateNotice = false
  public projectsTable: any[] = [];
  sqlTableName: string = '';
  sqlSuccess: boolean = false;

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  selectedFormat: string = '';

  notices: any[] = [];
  top100Items: any[] = [];
  inputFilePath = 'd:/output/output_with_line_numbers.txt';
  subFilesInfo = [
    { start: 1, end: 59 },
    { start: 87, end: 101 },
    { start: 159, end: 253 },
    { start: 269, end: 369 },
    { start: 371, end: 449 },
    { start: 487, end: 501 },
    { start: 561, end: 659 },
    { start: 703, end: 785 },
    { start: 833, end: 933 },
    { start: 961, end: 1085 },
    { start: 1093, end: 1171 },
    { start: 1187, end: 1313 },
    { start: 1351, end: 1453 },
    { start: 1461, end: 1479 },
    { start: 1531, end: 1597 },
    { start: 1643, end: 1661 },
    { start: 1713, end: 1819 },
    { start: 1851, end: 1967 },
    { start: 2021, end: 2111 },
    { start: 2121, end: 2185 },
    { start: 2197, end: 2215 },
    { start: 2267, end: 2355 },
    { start: 2365, end: 2463 },
    { start: 2479, end: 2497 },
    { start: 2549, end: 2649 },
    { start: 2673, end: 2729 },
    { start: 2779, end: 2837 },
    { start: 2881, end: 2899 },
    { start: 2953, end: 2971 },
    { start: 3023, end: 3041 },
    { start: 3091, end: 3109 },
    { start: 3155, end: 3173 },
  ];

  constructor(
    private projectsService: ProjectService,
    private toastr: ToastrService,
    private http: HttpClient, public service: TratServicesService,
    private apiService: NetService, private convert: ConvertdocxService, private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.service.getNotices().subscribe((data: string) => {
      this.notices = JSON.parse(data);
      this.firstFormGroup = this._formBuilder.group({
        firstCtrl: ['', Validators.required],
      });
      this.secondFormGroup = this._formBuilder.group({
        secondCtrl: ['', Validators.required],
      });
    });

    this.apiService.getTop100Items().subscribe(
      (data: string) => {
        this.top100Items = JSON.parse(data);
        console.log(this.top100Items);
      },
      (error) => {
        console.error('Une erreur s\'est produite :', error);
      }
    );
    this.fetchProjects();
    this.loadJugements();
  }

  loadJugements() {
    this.apiService.getJugements(this.pageNumber, this.pageSize).subscribe(response => {
      this.jugements = response.items;
      this.totalItems = response.totalItems;
    }, error => {
      console.error('Error loading jugements:', error);
    });
  }

  onPageChange(pageNumber: number) {
    if (pageNumber > 0 && (pageNumber - 1) * this.pageSize < this.totalItems) {
      this.pageNumber = pageNumber;
      this.loadJugements();
    }
  }
  generateSql(){
  this.apiService.getTop100Items().subscribe(
(data: string) => {
  this.top100Items = JSON.parse(data);
  this.sqlSuccess = true;
//  console.log(this.top100Items);
  this.toastr.success('Conversion réussie', 'Success');
},
(error) => {
//  console.error('Une erreur s\'est produite :', error);
  this.toastr.error('Erreur lors de la conversion', 'Error');

}
);
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

  processFiles() {
    this.convert.processFiles(this.inputFilePath, this.subFilesInfo).subscribe(
      response => {
        console.log(response);
        this.toastr.success('Sub-files generated and cleaned', 'Success');
        this.conversionSuccess = true;
        this.stepper.next();
      },
      error => {
        console.error('Error:', error);
        this.toastr.error('Failed to process files', 'Error');
      }
    );
  }

  onSubmit() {
    if (!this.input) {
      this.toastr.error("Veuillez saisir un chemin de fichier .docx", 'Error');
      return;
    }

    this.convert.convertDocxToTxt(this.input).subscribe(
      (response: any) => {
        console.log("Conversion réussie :", response);
        this.toastr.success('Conversion réussie', 'Success');
        this.conversionSuccess = true;
        this.stepper.next();
      },
      (error: any) => {
        console.error("Erreur lors de la conversion :", error);
        this.toastr.error('Erreur lors de la conversion', 'Error');
      }
    );
  }

  showCarousel = false;

  generateNotices() {
    if (this.conversionSuccess) {
      this.showCarousel = true;
      this.generateNotice = true
      this.toastr.success('Conversion réussie', 'Success');
    } else {
      this.toastr.error('Erreur lors de la conversion', 'Error');
    }
  }

  goBackToStepper() {
    this.showCarousel = false;
    this.generateNotice = false
  }
}
