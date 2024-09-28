import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from "@angular/material/stepper";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { TratServicesService } from "../services/trat-services.service";
import { ProjectService } from "../dashboard/project.service";

@Component({
  selector: 'app-converter-and-clean-sql-to-xml-csv',
  templateUrl: './converter-and-clean-sql-to-xml-csv.component.html',
  styleUrls: ['./converter-and-clean-sql-to-xml-csv.component.scss']
})
export class ConverterAndCleanSqlToXmlCsvComponent implements OnInit {

  @ViewChild('stepper') private stepper: MatStepper;
  selectedFormat: string = '';
  selectedProject: string = '';
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  public projectsTable: any[] = [];

  constructor(
    private toastr: ToastrService,
    private _formBuilder: FormBuilder,
    private service: TratServicesService,
    private projectsService: ProjectService
  ) {}

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      csvPathCtrl: ['', Validators.required]
    });

    this.secondFormGroup = this._formBuilder.group({
      xmlPathCtrl: ['', Validators.required]
    });

    this.fetchProjects();
  }

  onProjectChange() {
    if (this.selectedProject === 'trat') {
      this.firstFormGroup.get('csvPathCtrl').setValue('C:\\Users\\lahbi\\OneDrive\\Bureau\\jugement-output\\trat-jugement\\jugement.csv');
      this.secondFormGroup.get('xmlPathCtrl').setValue('C:\\Users\\lahbi\\OneDrive\\Bureau\\jugement-output\\trat-jugement\\jugement.xml');
    } else {
      this.firstFormGroup.get('csvPathCtrl').setValue('');
      this.secondFormGroup.get('xmlPathCtrl').setValue('');
    }
  }

  onSubmit() {
    if (this.firstFormGroup.valid && this.secondFormGroup.valid && this.selectedProject === 'trat') {
      this.generateFiles();
    } else if (this.selectedProject !== 'trat') {
      this.toastr.error('Please select the "trat" project.');
    } else {
      this.toastr.error('Please fill in all required fields.');
    }
  }

  generateFiles() {
    this.service.generateFiles().subscribe(
      (response) => {
        this.toastr.success('Files generated successfully.');
        this.stepper.next(); // Move to next step after success
      },
      (error) => {
        this.toastr.error('Error generating files.');
        console.error('Error:', error);
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
}
