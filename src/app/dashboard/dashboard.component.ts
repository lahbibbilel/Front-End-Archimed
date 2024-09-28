import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { CalendarService } from '../calendar/calendar.service';
import Swal from 'sweetalert2';
import { UsersCrudService } from '../crud-users/users-crud.service';
import { ProjectService } from './project.service';
import {LoginService} from "../authentification/login/login.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookiesForDashboardService} from "./cookies-for-dashboard.service";
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { MatInputModule } from '@angular/material/input';


import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {PageEvent} from "@angular/material/paginator";
import {catchError, tap} from "rxjs/operators";
import {of} from "rxjs";
import {SmtpService} from "../authentification/smtp-springboot/smtp.service";
import { DataSyncService } from './data-sync.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  @ViewChild('content', {static: false}) content: ElementRef;
  @ViewChild('contentIACSV', {static: false}) contentIACSV: ElementRef;

  @ViewChild('selectedCSV', {static: false}) selectedCSV: ElementRef;
  @ViewChild('contentXmlIA', {static: false}) contentXmlIA: ElementRef;


  @ViewChild('contentXml', {static: false}) contentXml: ElementRef;

  isLoading: boolean = false;
  public tasksTable: any[] = [];
  public employeesTable: any[] = [];
  public projectsTable: any[] = [];
  users: any[] = [];
  inputFilePath: string = '';
  selectedFormat: string = '';
  filteredProjects = [];
  filteredTasks = [];
  filteredUsers = [];

  paginatedProjects = [];
  paginatedTasks = [];
  paginatedUsers = [];

  totalProjects = 0;
  totalTasks = 0;
  totalUsers = 0;

  pageSize = 5;
  pageIndex = 0;


  searchText: string = '';

  chunkedAttributes: string[][] = [];

  constructor(
    private serviceTask: CalendarService,
    private employeesService: UsersCrudService,
    public projectsService: ProjectService,
    private serviceAuth: LoginService,
    private http: HttpClient,
    private cookiesService: CookiesForDashboardService,
    private emailService: SmtpService
    ,private dataSync: DataSyncService
  ) {


  }

  emailManager: any;
  selectedManager: any;

  onProjectChange(event: Event): void {
    const selectedProjectName = (event.target as HTMLSelectElement).value;
    this.selectedProject = this.projectsTable.find(project => project.nom === selectedProjectName);

    this.projectsService.getProjectByName(selectedProjectName).subscribe((response) => {
      // Ici, 'response' est l'objet avec les données du projet et les managers
      if (response && response.managers) {
        this.selectedManager = response.managers;
        console.log(this.selectedManager, 'email');

        this.emailManager = this.selectedManager[0];
        console.log(this.emailManager, 'test');
      }
    });
  }

  ngOnInit() {
    this.fetchTasks();
    this.fetchUsers();
    this.fetchProjects();

    this.dataSync.taskChanges$.subscribe(() => {
      this.fetchTasks();
    });


    this.dataSync.userChanges$.subscribe(() => {
      this.fetchUsers();
    });

    // Subscribe to project changes
    this.dataSync.projectChanges$.subscribe(() => {
      this.fetchProjects();
    });

    this.dataSync.facialChanges$.subscribe(
      ()=>{
        this.fetchUsers()
      }
    )
  }



  // this.addUserWithFace()
   // this.chunkedAttributes = this.chunkArray(this.similarAttributesoutputxml, 10);


 /* chunkArray(arr: string[], chunkSize: number): string[][] {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  }*/
  inputFilePathCsvAnalyse: string = "";
  csvAttributesoutput: any;
  nullAttributesoutput: any;
  similarAttributesoutput: any;
  rowCountoutput: any;
  attributeCountoutput: any;
  mistralResponse: any;

  isAnalysisComplete = false;

  invokeMistralAPI() {
    const requestBody = {
      content: JSON.stringify({
        csvAttributes: this.csvAttributesoutput,
        nullAttributes: this.nullAttributesoutput,
        similarAttributes: this.similarAttributesoutput,
        rowCount: this.rowCountoutput,
        attributeCount: this.attributeCountoutput
      })
    };

    this.http.post<any>('http://localhost:3005/invokeLLM', requestBody).subscribe(
      (response: any) => {
        this.mistralResponse = response;
        this.isLoading = false; // Set loading state to false after Mistral API response
        console.log('Mistral API Response:', response);
        Swal.fire('Success', 'Analysis completed', 'success');
      },
      (error: any) => {
        this.isLoading = false; // Set loading state to false on error
        Swal.fire('Error', 'Failed to invoke Mistral API', 'error');
        console.error('Mistral API Error:', error);
      }
    );
  }


  inputFilePathXmlAnalyse: string = "";
  xmlAttributesoutput: any;
  nullAttributesoutputxml: any;
  similarAttributesoutputxml: any;
  rowCountoutputxml: any;
  mistralResponseXml: any;
  repeatedAttributes: any[] = [];


  public splitAttributes(attributes: string[], chunkSize: number = 10): string[][] {
    const result: string[][] = [];
    for (let i = 0; i < attributes.length; i += chunkSize) {
      result.push(attributes.slice(i, i + chunkSize));
    }
    return result;
  }
  public similarAttributesoutputxmlFormatted: string = '';

  CountCsvAttributes() {
    if (!this.inputFilePathCsvAnalyse) {
      Swal.fire('Error', 'Please provide a file path', 'error');
      return;
    }

    this.isLoading = true; // Set loading state to true
    this.isAnalysisComplete = false; // Reset analysis completion state

    this.http.post<any>('http://localhost:3001/count-csv-attributes', { csvFilePath: this.inputFilePathCsvAnalyse }).subscribe(
      (response: any) => {
        this.csvAttributesoutput = response.csvAttributes;
        this.nullAttributesoutput = response.nullAttributes;
        this.similarAttributesoutput = response.similarAttributes;
        this.rowCountoutput = response.rowCount;
        this.attributeCountoutput = response.attributeCount;

        // Call the Mistral API after receiving the CSV analysis response
        this.invokeMistralAPI();
        this.isAnalysisComplete = true

      },
      (error: any) => {
        this.isLoading = false; // Set loading state to false on error
        this.isAnalysisComplete = true; // Set analysis completion state

        Swal.fire('Error', 'Failed to retrieve attributes', 'error');
        console.error('POST Error:', error);
      }
    );
  }


  CountXmlAttributes() {
    if (!this.inputFilePathXmlAnalyse) {
      Swal.fire('Error', 'Please provide a file path', 'error');
      return;
    }
    this.isLoading = true; // Set loading state to true
    this.isAnalysisComplete = false; // Reset analysis completion state

    const requestBody = { filePath: this.inputFilePathXmlAnalyse };

    this.http.post<any>('http://localhost:5000/items/count-notices2', requestBody).subscribe(
      (response: any) => {
        this.xmlAttributesoutput = response.recordCount;
        this.nullAttributesoutputxml = response.fieldCount;
        this.similarAttributesoutputxml = response.attributes;
        this.repeatedAttributes = response.repeatedAttributes; // Assign the repeated attributes to a class property
        this.invokeMistralAPIXml();
        this.isAnalysisComplete = true
        this.similarAttributesoutputxmlFormatted = this.chunkAttributes(this.similarAttributesoutputxml, 10);

    //    Swal.fire('Success', 'Analysis completed', 'success');
      },
      (error: any) => {
        this.isLoading = false; // Set loading state to false on error
        this.isAnalysisComplete = true; // Set analysis completion state

        Swal.fire('Error', 'Failed to retrieve attributes', 'error');
        console.error('POST Error:', error);
      }
    );
  }



  private chunkAttributes(attributes: string[], chunkSize: number): string {
    let result = '';
    for (let i = 0; i < attributes.length; i += chunkSize) {
      result += attributes.slice(i, i + chunkSize).join(', ') + '<br/>';
    }
    return result;
  }

  invokeMistralAPIXml() {
    const requestBody = {
      content: JSON.stringify({
        xmlAttributes: this.xmlAttributesoutput,
        nullAttributesxml: this.nullAttributesoutputxml,
        similarAttributesxml: this.similarAttributesoutputxml,
        rowCountxml: this.repeatedAttributes,
      })
    };

    this.http.post<any>('http://localhost:3005/invokeLLM', requestBody).subscribe(
      (response: any) => {
        this.mistralResponseXml = response;
        this.isLoading = false; // Set loading state to false after Mistral API response
        Swal.fire('Success', 'Analysis completed', 'success');
        console.log('Mistral API Response:', response);
      },
      (error: any) => {
        Swal.fire('Error', 'Failed to invoke Mistral API. Please check your subscription or usage limits.', 'error');
        this.isLoading = false; // Set loading state to false after Mistral API response
        console.error('Mistral API Error:', error);
      }
    );
  }
  firstLine: string;
  inputFilePathCsv: string = '';


  PathCount: string;
  inputFilePathCount: string = '';


  PathCommen: string;
  inputFilePathCommen: string = '';
  key: any
  value: any


  downloadPDFXml() {
    const tableContent = this.contentXml.nativeElement;
    const IAContent = this.contentXmlIA.nativeElement;

    // Create a new jsPDF instance
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Set loading state to true before starting the PDF generation
    this.isLoading = true;

    // Add the table content as the first page
    html2canvas(tableContent).then(canvas => {
      const imgWidth = 208; // Width in mm for A4
      const pageHeight = 295; // Height in mm for A4
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      let position = 0;

      // Add image to PDF (First Page)
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

      // Check if additional space is needed for more content
      if (heightLeft > pageHeight) {
        pdf.addPage();
        position = 0;
      }

      // Add the AI Analysis content to the second page
      html2canvas(IAContent).then(canvasIA => {
        const imgWidthIA = 208; // Width in mm for A4
        const imgHeightIA = canvasIA.height * imgWidthIA / canvasIA.width;
        const contentDataURLIA = canvasIA.toDataURL('image/png');

        // Add the AI Analysis content as a new page
        pdf.addPage();
        pdf.addImage(contentDataURLIA, 'PNG', 0, 0, imgWidthIA, imgHeightIA);

        // Save the generated PDF
        pdf.save('analysis-xml-dataflow.pdf');
        Swal.fire('Success', 'Analysis download is pending until the email is sent to the project manager', 'success');

        // Prepare FormData to send the email
        const pdfBlob = pdf.output('blob');
        const formData = new FormData();
        const Manager = this.emailManager;
        formData.append('email', Manager); // Email address to send to
        formData.append('subject', 'Project Analysis Report'); // Subject of the email
        formData.append('text', 'Please find the attached project analysis report.'); // Plain text content
        formData.append('html', '<p>Please find the attached project analysis report.</p>'); // HTML content
        formData.append('pdf', pdfBlob, 'analysis-report.pdf'); // Append PDF blob

        // Send the email with the PDF attachment
        this.http.post('http://localhost:3000/send-email', formData).subscribe(
          () => {
            this.isLoading = false; // Set loading state to false on success
            Swal.fire('Success', 'Email sent to the manager', 'success');
          },
          (error) => {
            this.isLoading = false; // Set loading state to false on error
            Swal.fire('Error', 'Failed to send email', 'error');
            console.error('Email sending error:', error);
          }
        );
      }).catch(error => {
        this.isLoading = false; // Ensure loading state is reset if capturing fails
        console.error('Error capturing the AI Analysis content for PDF:', error);
      });
    }).catch(error => {
      this.isLoading = false; // Ensure loading state is reset if capturing fails
      console.error('Error capturing the table content for PDF:', error);
    });

  }


  downloadPDF() {
    const tableContent = this.content.nativeElement;
    const IAContent = this.contentIACSV.nativeElement;

    // Create a new jsPDF instance
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Set loading state to true before starting the PDF generation
    this.isLoading = true;

    // Add the table content as the first page
    html2canvas(tableContent).then(canvas => {
      const imgWidth = 208; // Width in mm for A4
      const pageHeight = 295; // Height in mm for A4
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      let position = 0;

      // Add image to PDF (First Page)
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

      // Check if additional space is needed for more content
      if (heightLeft > pageHeight) {
        pdf.addPage();
        position = 0;
      }

      // Add the AI Analysis content to the second page
      html2canvas(IAContent).then(canvasIA => {
        const imgWidthIA = 208; // Width in mm for A4
        const imgHeightIA = canvasIA.height * imgWidthIA / canvasIA.width;
        const contentDataURLIA = canvasIA.toDataURL('image/png');

        // Add the AI Analysis content as a new page
        pdf.addPage();
        pdf.addImage(contentDataURLIA, 'PNG', 0, 0, imgWidthIA, imgHeightIA);

        // Save the generated PDF
        pdf.save('analysis-csv-dataflow.pdf');
        Swal.fire('Success', 'Analysis download is pending until the email is sent to the project manager', 'success');

        // Prepare FormData to send the email
        const pdfBlob = pdf.output('blob');
        const formData = new FormData();
        const Manager = this.emailManager;
        formData.append('email', Manager); // Email address to send to
        formData.append('subject', 'Project Analysis Report'); // Subject of the email
        formData.append('text', 'Please find the attached project analysis report.'); // Plain text content
        formData.append('html', '<p>Please find the attached project analysis report.</p>'); // HTML content
        formData.append('pdf', pdfBlob, 'analysis-report.pdf'); // Append PDF blob

        // Send the email with the PDF attachment
        this.http.post('http://localhost:3000/send-email', formData).subscribe(
          () => {
            this.isLoading = false; // Set loading state to false on success
            Swal.fire('Success', 'Email sent to the manager', 'success');
          },
          (error) => {
            this.isLoading = false; // Set loading state to false on error
            Swal.fire('Error', 'Failed to send email', 'error');
            console.error('Email sending error:', error);
          }
        );
      }).catch(error => {
        this.isLoading = false; // Ensure loading state is reset if capturing fails
        console.error('Error capturing the AI Analysis content for PDF:', error);
      });
    }).catch(error => {
      this.isLoading = false; // Ensure loading state is reset if capturing fails
      console.error('Error capturing the table content for PDF:', error);
    });
  }


  fetchTasks() {
    this.serviceTask.getCalendars().subscribe(
      (response: any) => {
        this.tasksTable = response;
        this.filteredTasks = this.tasksTable; // Initialement afficher toutes les tâches
        this.totalTasks = this.filteredTasks.length;
        this.updateTasksPagination();
      },
      (error: any) => {
        console.log('Vous avez un problème', error);
      }
    );
  }

  fetchUsers() {
    this.employeesService.getUsers().subscribe(
      (response: any) => {
        this.employeesTable = response;
        this.filteredUsers = this.users; // Initially show all users
        this.totalUsers = this.filteredUsers.length;
        this.updateUsersPagination();
      },
      (error: any) => {
        console.log('You have a problem', error);
      }
    );
  }

  selectedProject: string;
selectedUser : string;
  fetchProjects() {
    this.projectsService.getProjects().subscribe(
      (response: any) => {
        this.projectsTable = response;
        this.filteredProjects = this.projectsTable; // Initially show all projects

        this.totalProjects = this.filteredProjects.length;
        this.updateProjectsPagination();


      },
      (error: any) => {
        console.log('You have a problem', error);
      }
    );
  }


  searchProjects(searchTerm: string) {
    if (!searchTerm) {
      this.filteredProjects = this.projectsTable; // Montrer tous les projets si la recherche est vide
    } else {
      this.filteredProjects = this.projectsTable.filter(project =>
        project.nom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    this.totalProjects = this.filteredProjects.length;
    this.updateProjectsPagination();
  }

  searchTasks(searchTerm: string) {
    if (!searchTerm) {
      this.filteredTasks = this.tasksTable; // Montrer toutes les tâches si la recherche est vide
    } else {
      this.filteredTasks = this.tasksTable.filter(task =>
        task.tasks.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    this.totalTasks = this.filteredTasks.length;
    this.updateTasksPagination();
  }


  searchUsers(searchTerm: string) {
    if (!searchTerm) {
      this.filteredUsers = this.users; // Montrer tous les utilisateurs si la recherche est vide
    } else {
      this.filteredUsers = this.users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    this.totalUsers = this.filteredUsers.length;
    this.updateUsersPagination();
  }

  updateProjectsPagination(event?: PageEvent) {
    const pageIndex = event ? event.pageIndex : 0;
    const pageSize = event ? event.pageSize : this.pageSize;
    this.paginatedProjects = this.filteredProjects.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
  }

  updateTasksPagination(event?: PageEvent) {
    const pageIndex = event ? event.pageIndex : 0;
    const pageSize = event ? event.pageSize : this.pageSize;
    this.paginatedTasks = this.filteredTasks.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
  }

  updateUsersPagination(event?: PageEvent) {
    const pageIndex = event ? event.pageIndex : 0;
    const pageSize = event ? event.pageSize : this.pageSize;
    this.paginatedUsers = this.filteredUsers.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
  }

  onPageChange(event: PageEvent) {
    this.updateProjectsPagination(event);
    this.updateTasksPagination(event);
    this.updateUsersPagination(event);
  }

  onPageChangeTasks(event: PageEvent) {
    this.updateTasksPagination(event);
  }

  onPageChangeUsers(event: PageEvent) {
    this.updateUsersPagination(event);
  }

  addTask() {
    const projectOptions = this.projectsTable.map(project =>
      `<option value="${project._id}">${project.nom}</option>`
    ).join('');

    const userOptions = this.employeesTable.map(user =>
      `<option value="${user._id}">${user.name}</option>`
    ).join('');

    Swal.fire({
      title: 'Add Task',
      html: `
    <div style="max-height: 400px; overflow-y: auto;">
      <div style="margin-bottom: 15px;">
        <label for="task" style="display: block;">Task :</label>
        <input id="task" class="swal2-input" placeholder="Task">
      </div>

      <div style="margin-bottom: 15px;">
        <label for="start_date" style="display: block;">Start Date :</label>
        <input id="start_date" class="swal2-input" type="datetime-local">
      </div>

      <div style="margin-bottom: 15px;">
        <label for="end_date" style="display: block;">End Date :</label>
        <input id="end_date" class="swal2-input" type="datetime-local">
      </div>

      <div style="margin-bottom: 15px;">
        <label for="project" style="display: block;">Project :</label>
        <select id="project" class="swal2-input">
          <option value="">Select Project</option>
          ${projectOptions}
        </select>
      </div>

      <div style="margin-bottom: 15px;">
        <label for="user" style="display: block;">User :</label>
        <select id="user" class="swal2-input">
          <option value="">Select User</option>
          ${userOptions}
        </select>
      </div>
    </div>
  `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Exit',
      preConfirm: () => {
        const task = (document.getElementById('task') as HTMLInputElement).value;
        const start_date = (document.getElementById('start_date') as HTMLInputElement).value;
        const end_date = (document.getElementById('end_date') as HTMLInputElement).value;
        const project = (document.getElementById('project') as HTMLSelectElement).value;
        const user = (document.getElementById('user') as HTMLSelectElement).value;

        if (!task || !start_date || !end_date || !project || !user) {
          Swal.showValidationMessage(`Please fill all fields`);
          return;
        }

        // Find the selected project
        const selectedProject = this.projectsTable.find(p => p._id === project);

        // Validate task dates against project dates
        if (new Date(start_date) < new Date(selectedProject.start_date)) {
          Swal.showValidationMessage(`Start Date of task should be after or equal to Project's Start Date (${selectedProject.start_date})`);
          return;
        }

        if (new Date(end_date) > new Date(selectedProject.end_date)) {
          Swal.showValidationMessage(`End Date of task should be before or equal to Project's End Date (${selectedProject.end_date})`);
          return;
        }

        const newTask = {
          tasks: task,
          start_task: new Date(start_date).toISOString(),
          end_task: new Date(end_date).toISOString(),
          projects: [project],
          users: [user]
        };

        const userId = this.getUserIdFromCookies();

        return this.serviceTask.addTaskCalendar(newTask).toPromise().then(
          (response: any) => {
            this.tasksTable.push(response);
            Swal.fire('Success', `Task added successfully! User ID: ${userId}`, 'success');
          },
          (error: any) => {
            console.error('Error adding task:', error);
            Swal.fire('Error', 'Failed to add task', 'error');
          }
        );
      }
    });
  }

  updateTask(task) {
    const projectOptions = this.projectsTable.map(project =>
      `<option value="${project._id}" ${task.projects.includes(project._id) ? 'selected' : ''}>${project.nom}</option>`
    ).join('');

    const userOptions = this.employeesTable.map(user =>
      `<option value="${user._id}" ${task.users.includes(user._id) ? 'selected' : ''}>${user.name}</option>`
    ).join('');

    Swal.fire({
      title: 'Update Task',
      html: `
    <div style="max-height: 400px; overflow-y: auto;">
      <div style="margin-bottom: 15px;">
        <label for="task" style="display: block;">Task :</label>
        <input id="task" class="swal2-input" placeholder="Task" value="${task.tasks}">
      </div>

      <div style="margin-bottom: 15px;">
        <label for="start_date" style="display: block;">Start Date :</label>
        <input id="start_date" class="swal2-input" type="datetime-local" value="${new Date(task.start_task).toISOString().slice(0, 16)}">
      </div>

      <div style="margin-bottom: 15px;">
        <label for="end_date" style="display: block;">End Date :</label>
        <input id="end_date" class="swal2-input" type="datetime-local" value="${new Date(task.end_task).toISOString().slice(0, 16)}">
      </div>

      <div style="margin-bottom: 15px;">
        <label for="project" style="display: block;">Project :</label>
        <select id="project" class="swal2-input">
          <option value="">Select Project</option>
          ${projectOptions}
        </select>
      </div>

      <div style="margin-bottom: 15px;">
        <label for="user" style="display: block;">User :</label>
        <select id="user" class="swal2-input">
          <option value="">Select User</option>
          ${userOptions}
        </select>
      </div>
    </div>
  `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Exit',
      preConfirm: () => {
        const taskValue = (document.getElementById('task') as HTMLInputElement).value;
        const start_date = (document.getElementById('start_date') as HTMLInputElement).value;
        const end_date = (document.getElementById('end_date') as HTMLInputElement).value;
        const project = (document.getElementById('project') as HTMLSelectElement).value;
        const user = (document.getElementById('user') as HTMLSelectElement).value;

        if (!taskValue || !start_date || !end_date || !project || !user) {
          Swal.showValidationMessage(`Please fill all fields`);
          return;
        }

        // Find the selected project
        const selectedProject = this.projectsTable.find(p => p._id === project);

        // Validate task dates against project dates
        if (new Date(start_date) < new Date(selectedProject.start_date)) {
          Swal.showValidationMessage(`Start Date of task should be after or equal to Project's Start Date (${selectedProject.start_date})`);
          return;
        }

        if (new Date(end_date) > new Date(selectedProject.end_date)) {
          Swal.showValidationMessage(`End Date of task should be before or equal to Project's End Date (${selectedProject.end_date})`);
          return;
        }

        const updatedTask = {
          tasks: taskValue,
          start_task: new Date(start_date).toISOString(),
          end_task: new Date(end_date).toISOString(),
          projects: [project],
          users: [user]
        };

        return this.serviceTask.updateTask(task._id, updatedTask).toPromise().then(
          (response: any) => {
            const index = this.tasksTable.findIndex(t => t._id === task._id);
            this.tasksTable[index] = response;
            Swal.fire('Success', 'Task updated successfully!', 'success');
          },
          (error: any) => {
            console.error('Error updating task:', error);
            Swal.fire('Error', 'Failed to update task', 'error');
          }
        );
      }
    });
  }



  getUserIdFromCookies(): string {
    // Replace this with your actual logic to get user ID from cookies
    return this.serviceAuth.getId();
  }


  confirmDelete(task) {
    this.serviceTask.deleteTask(task._id).subscribe(
      () => {
        this.tasksTable = this.tasksTable.filter(t => t._id !== task._id);
        Swal.fire('Success', 'Task deleted successfully!', 'success');
      },
      (error: any) => {
        console.error('Error deleting task:', error);
        Swal.fire('Error', 'Failed to delete task', 'error');
      }
    );
  }

  getUserNameById(userIds: string[]): string {
    if (!userIds || userIds.length === 0) {
      return 'No Manager';
    }

    // Trouver le premier utilisateur dont l'ID correspond et vérifier son rôle
    const user = this.employeesTable.find(user =>
      userIds.includes(user._id) && user.role === 'MANAGER'
    );

    return user ? user.name : 'No Manager'; // Affiche 'No Manager' si aucun utilisateur avec le rôle MANAGER n'est trouvé
  }

  getUserNameTaskById(userIds: string[]): string {
    if (!userIds || userIds.length === 0) {
      return 'No User';
    }

    // Trouver le premier utilisateur dont l'ID correspond et vérifier son rôle
    const user = this.employeesTable.find(user =>
      userIds.includes(user._id)
    );

    // Retourner le nom de l'utilisateur s'il est trouvé, sinon 'No Manager'
    return user ? user.name : 'No User';
  }




  addProject() {
    const userOptions = this.employeesTable.map(user =>
      `<div><input type="checkbox" id="user_${user._id}" value="${user._id}"> <label for="user_${user._id}">${user.name} ${user.lastname}  ( ${user.role} )</label></div>`
    ).join('');

    Swal.fire({
      title: 'Add Project',
      html: `
      <div style="max-height: 300px; overflow-y: auto; padding-right: 10px;"> <!-- Scrollable section -->
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div>
            <label for="projectName" style="display: block; margin-bottom: 5px;">Project Name :</label>
            <input id="projectName" class="swal2-input" placeholder="Project Name">
          </div>

          <div>
            <label for="projectDescription" style="display: block; margin-bottom: 5px;">Project Description :</label>
            <textarea id="projectDescription" class="swal2-textarea" placeholder="Project Description"></textarea>
          </div>

          <div>
            <label for="startDate" style="display: block; margin-bottom: 5px;">Start Date :</label>
            <input id="startDate" class="swal2-input" type="date">
          </div>

          <div>
            <label for="endDate" style="display: block; margin-bottom: 5px;">End Date :</label>
            <input id="endDate" class="swal2-input" type="date">
          </div>

          <div>
            <label for="users" style="display: block; margin-bottom: 5px;">Assign Users :</label>
            <div id="users" class="swal2-checkbox-group" style="display: block;">${userOptions}</div>
          </div>
        </div>
      </div>
    `,
      showCancelButton: true, // Adds the 'Exit' button
      confirmButtonText: 'Add Project',
      cancelButtonText: 'Exit',
      focusConfirm: false,
      preConfirm: () => {
        const projectName = (document.getElementById('projectName') as HTMLInputElement).value;
        const projectDescription = (document.getElementById('projectDescription') as HTMLTextAreaElement).value;
        const startDate = (document.getElementById('startDate') as HTMLInputElement).value;
        const endDate = (document.getElementById('endDate') as HTMLInputElement).value;

        // Get selected users from checkboxes
        const selectedUsers = Array.from(document.querySelectorAll('#users input[type="checkbox"]:checked'))
          .map(checkbox => (checkbox as HTMLInputElement).value);

        if (!projectName || !projectDescription || !startDate || !endDate || selectedUsers.length === 0) {
          Swal.showValidationMessage('Please fill all fields and select at least one user');
          return;
        }

        const newProject = {
          nom: projectName,
          description: projectDescription,
          start_date: startDate,
          end_date: endDate,
          users: selectedUsers
        };

        this.projectsService.addProject(newProject).subscribe(
          (response: any) => {
            this.projectsTable.push(response);
            Swal.fire('Success', 'Project added successfully!', 'success');
          },
          (error: any) => {
            console.error('Error adding project:', error);
            Swal.fire('Error', 'Failed to add project', 'error');
          }
        );
      }
    });
  }

  updateProject(project) {

    const formatDate = (date: string) => {
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    };
    // Génération des options utilisateur avec des cases à cocher
    const userOptions = this.employeesTable.map(user => `
    <div>
      <input type="checkbox" id="user_${user._id}" value="${user._id}" ${project.users.includes(user._id) ? 'checked' : ''}>
      <label for="user_${user._id}">${user.name + ' ' + user.lastname}</label>
    </div>
  `).join('');

    Swal.fire({
      title: 'Update Project',
      html: `
      <div style="max-height: 400px; overflow-y: auto;">
       <div> <label for="projectName">Project Name :</label>
        <input id="projectName" class="swal2-input" placeholder="Project Name" value="${project.nom}">
</div>
      <div>
        <label for="projectDescription">Project Description :</label>
        <textarea id="projectDescription" class="swal2-textarea" placeholder="Project Description">${project.description}</textarea>
</div>
<div>
        <label for="startDate">Start Date :</label>
        <br>
          <input id="startDate" class="swal2-input" type="date" value="${formatDate(project.start_date)}">
</div>
<div>
        <label for="endDate">End Date :</label>
        <br>
          <input id="endDate" class="swal2-input" type="date" value="${formatDate(project.end_date)}">
</div>
<div>
        <label>Assign Users :</label>
        <br>
        <br><br>
        <div id="users" class="swal2-checkbox-group">${userOptions}</div>
     </div>
      </div>
    `,
      showCancelButton: true, // Ajoute le bouton 'Exit'
      confirmButtonText: 'Update Project',
      cancelButtonText: 'Exit',
      focusConfirm: false,
      preConfirm: () => {
        const projectName = (document.getElementById('projectName') as HTMLInputElement).value;
        const projectDescription = (document.getElementById('projectDescription') as HTMLTextAreaElement).value;
        const startDate = (document.getElementById('startDate') as HTMLInputElement).value;
        const endDate = (document.getElementById('endDate') as HTMLInputElement).value;

        // Obtenir les utilisateurs sélectionnés à partir des cases à cocher
        const selectedUsers = Array.from(document.querySelectorAll('#users input[type="checkbox"]:checked'))
          .map(checkbox => (checkbox as HTMLInputElement).value);

        if (!projectName || !projectDescription || !startDate || !endDate || selectedUsers.length === 0) {
          Swal.showValidationMessage('Please fill all fields and select at least one user');
          return;
        }

        const updatedProject = {
          nom: projectName,
          description: projectDescription,
          start_date: startDate,
          end_date: endDate,
          users: selectedUsers
        };

        this.projectsService.updateProject(project._id, updatedProject).subscribe(
          (response: any) => {
            const index = this.projectsTable.findIndex(p => p._id === project._id);
            this.projectsTable[index] = response;
            Swal.fire('Success', 'Project updated successfully!', 'success');
          },
          (error: any) => {
            console.error('Error updating project:', error);
            Swal.fire('Error', 'Failed to update project', 'error');
          }
        );
      }
    });
  }

  deleteProject(project) {
    Swal.fire({
      title: 'Delete Project',
      text: `Are you sure you want to delete "${project.nom}" project?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.projectsService.deleteProject(project._id).subscribe(
          () => {
            this.projectsTable = this.projectsTable.filter(p => p._id !== project._id);
            Swal.fire('Success', 'Project deleted successfully!', 'success');
          },
          (error: any) => {
            console.error('Error deleting project:', error);
            Swal.fire('Error', 'Failed to delete project', 'error');
          }
        );
      }
    });
  }

//module user

  addUser() {
    Swal.fire({
      title: 'Add User',
      html: `
      <div style="max-height: 400px; overflow-y: auto;">
        <div>
          <label for="username">Username:</label>
          <input id="username" class="swal2-input" placeholder="Username">
        </div>
        <div>
          <label for="name">Firstname:</label>
          <input id="name" class="swal2-input" placeholder="Firstname">
        </div>
        <div>
          <label for="lastname">Lastname:</label>
          <input id="lastname" class="swal2-input" placeholder="Lastname">
        </div>
        <div>
          <label for="email">Email:</label>
          <br>
          <input id="email" class="swal2-input" type="email" placeholder="Email">
        </div>
        <div>
          <label for="password">Password:</label>
          <input id="password" class="swal2-input"  placeholder="Password">
        </div>
        <div>
          <label for="confirmPassword">Confirm Password:</label>
          <input id="confirmPassword" class="swal2-input"  placeholder="Confirm Password">
        </div>
        <div>
          <label for="role">Role:</label>
          <br>
          <input id="role" class="swal2-input" placeholder="Role">
        </div>
      </div>
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Exit',
      preConfirm: () => {
        const username = (document.getElementById('username') as HTMLInputElement).value;
        const name = (document.getElementById('name') as HTMLInputElement).value;
        const lastname = (document.getElementById('lastname') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;
        const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;
        const role = (document.getElementById('role') as HTMLInputElement).value;

        // Logging values for debugging
        console.log({ username, name, lastname, email, password, confirmPassword, role });

        if (!username || !name || !lastname || !email || !password || !confirmPassword || !role) {
          Swal.showValidationMessage('Please fill all fields');
          return;
        }

        if (password !== confirmPassword) {
          Swal.showValidationMessage('Passwords do not match');
          return;
        }

        const newUser = { username, name, lastname, email, password,confirmPassword, role };

        return this.employeesService.addUser(newUser).toPromise().then(
          (response: any) => {
            this.employeesTable.push(response);
            this.sendEmail(newUser);
            Swal.fire('Success', 'User Added successfully!', 'success');
            return response;
          },
          (error: any) => {
            console.error('Error adding user:', error);
            Swal.fire('Error', 'Failed to add user', 'error');
            return Promise.reject(error);
          }
        );
      }
    });
  }

  sendEmail(user: any) {
    const emailData = {
      subject: 'Welcome to our platform!',
      text: `Dear ${user.name},\n\n You are registering with us Archimed Mea.`,
      html: `<p>Dear ${user.name},</p><p>You are registering with us Archimed Mea.</p>,
<p>Your login is : ${user.email} <br> Your password is : ${user.confirmPassword}</p>
`,
      dest: [user.email],
      ccs: [],
      from: 'lahbibbilel07@gmail.com'
    };

    this.emailService.sendEmailAddUser(emailData).subscribe(
      () => {
        console.log('Email sent successfully to', user.email);
      },
      (error) => {
        console.error('Failed to send email:', error);
      }
    );
  }


  editUser(user: any) {
    Swal.fire({
      title: 'Edit User',
      html: `
      <div style="max-height: 400px; overflow-y: auto;">
        <label for="id">UserId:</label>
        <br>
        <input id="id" class="swal2-input" placeholder="UserId" value="${user._id}" readonly>

        <label for="username">Username:</label>
        <input id="username" class="swal2-input" placeholder="Username" value="${user.username}">

        <label for="name">Firstname:</label>
        <input id="name" class="swal2-input" placeholder="Firstname" value="${user.name}">

        <label for="lastname">Lastname:</label>
        <input id="lastname" class="swal2-input" placeholder="Lastname" value="${user.lastname}">
        <br>
        <label for="email">Email:</label>
        <br>
        <input id="email" class="swal2-input" type="email" placeholder="Email" value="${user.email}">
        <br>
        <label for="role">Role:</label>
        <br>
        <input id="role" class="swal2-input" placeholder="Role" value="${user.role}">
        <br>
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
        const updatedUser = {
          id: user._id,
          username: (document.getElementById('username') as HTMLInputElement).value,
          name: (document.getElementById('name') as HTMLInputElement).value,
          lastname: (document.getElementById('lastname') as HTMLInputElement).value,
          email: (document.getElementById('email') as HTMLInputElement).value,
          role: (document.getElementById('role') as HTMLInputElement).value,
          password: (document.getElementById('newPassword') as HTMLInputElement).value,
          confirmPassword : (document.getElementById('newPassword') as HTMLInputElement).value
        };

        const newPassword = (document.getElementById('newPassword') as HTMLInputElement).value;
        const confirmNewPassword = (document.getElementById('confirmNewPassword') as HTMLInputElement).value;

        if (newPassword && newPassword !== confirmNewPassword) {
          Swal.showValidationMessage('New passwords do not match');
          return;
        }

        if (!updatedUser.username || !updatedUser.name || !updatedUser.lastname || !updatedUser.email || !updatedUser.role) {
          Swal.showValidationMessage('Please fill all fields');
          return;
        }

        if (newPassword) {
          updatedUser.password = newPassword;
        }

        return this.employeesService.updateUser(user._id, updatedUser).toPromise().then(
          (response: any) => {
            const index = this.employeesTable.findIndex(u => u._id === response._id);
            this.employeesTable[index] = response;
            Swal.fire('Success', 'User updated successfully!', 'success');
          },
          (error: any) => {
            console.error('Error updating user:', error);
            Swal.fire('Error', 'Failed to update user', 'error');
          }
        );
      }
    });
  }
  deleteUser(user: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${user.username}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeesService.deleteUser(user._id).subscribe(
          () => {
            this.employeesTable = this.employeesTable.filter(u => u._id !== user._id);
            Swal.fire('Deleted!', 'User has been deleted.', 'success');
          },
          (error: any) => {
            console.error('Error deleting user:', error);
            Swal.fire('Error', 'Failed to delete user', 'error');
          }
        );
      }
    });
  }

  getProjectNameById(projectIds: any) {
    if (!projectIds || projectIds.length === 0) {
      return 'No Project';
    }

    const project = this.projectsTable.find(project => project._id === projectIds[0]); // Assuming one manager per project
    return project ? project.nom : 'Unknown';
  }


  clearSearch() {
      this.searchText = '';
      this.searchTasks(this.searchText);

  }
  addUserWithFace() {
    Swal.fire({
      title: 'Add User with Face Recognition',
      html: `
      <div id="scrollable-content" style="max-height: 400px; overflow-y: auto; text-align: center;">
        <label for="username">Username (USR):</label>
        <input id="username" class="swal2-input" placeholder="Enter your username">
        <div id="usernameError" style="color: red; font-size: 12px; display: none;"></div>

        <label for="name">Firstname (FN):</label>
        <input id="name" class="swal2-input" placeholder="Enter your firstname">
        <div id="nameError" style="color: red; font-size: 12px; display: none;"></div>

        <label for="lastname">Lastname (LN):</label>
        <input id="lastname" class="swal2-input" placeholder="Enter your lastname">
        <div id="lastnameError" style="color: red; font-size: 12px; display: none;"></div>

        <label for="email">Email (EM):</label>
        <input id="email" class="swal2-input" type="email" placeholder="Enter your email">
        <div id="emailError" style="color: red; font-size: 12px; display: none;"></div>

        <label for="password">Password (PWD):</label>
        <input id="password" class="swal2-input"  placeholder="Enter your password">
        <div id="passwordError" style="color: red; font-size: 12px; display: none;"></div>

        <label for="role">Role (RL):</label>
        <input id="role" class="swal2-input" value="MANAGER" placeholder="Enter your role">
        <div id="roleError" style="color: red; font-size: 12px; display: none;"></div>

        <label>Profile Picture:</label>

        <!-- Button container -->
        <div style="display: flex; justify-content: center; margin-bottom: 10px;">
          <button id="takePhoto" class="swal2-button" style="margin-right: 10px; display: none;">
            <i class="fas fa-camera"></i> Take Picture
          </button>
          <button id="closeCamera" class="swal2-button" style="display: none;">
            <i class="fas fa-times"></i> Exit
          </button>
        </div>

        <!-- Camera elements -->
        <div style="text-align: center; margin-top: 10px;">
          <canvas id="canvas" style="border-radius: 50%; display: none; width: 150px; height: 150px; border: 2px solid #ddd; margin: 0 auto;"></canvas>
          <video id="video" style="border-radius: 50%; width: 150px; height: 150px; display: none; margin: 0 auto;" autoplay></video>
        </div>

        <!-- Open camera button -->
        <div style="display: flex; justify-content: center; margin-top: 10px;">
          <button id="openCamera" class="swal2-button" disabled>
            <i class="fas fa-camera"></i> Open Camera
          </button>
        </div>
      </div>
    `,      showCancelButton: true,
      cancelButtonText: 'Exit',
      confirmButtonText: 'Save',
      focusConfirm: false,
      didOpen: () => {
        const video = document.getElementById('video') as HTMLVideoElement;
        const openCameraButton = document.getElementById('openCamera') as HTMLButtonElement;
        const takePhotoButton = document.getElementById('takePhoto') as HTMLButtonElement;
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const context = canvas.getContext('2d');
        const confirmButton =  Swal.getConfirmButton() as HTMLButtonElement;

        const allInputs = ['username', 'name', 'lastname', 'email', 'password', 'role']
          .map(id => document.getElementById(id) as HTMLInputElement);

        let pictureTaken = false;

        const checkInputs = () => {
          const allFilled = allInputs.every(input => input.value.trim() !== '');
          openCameraButton.disabled = !allFilled;
          confirmButton.disabled = !allFilled || !pictureTaken;
        };

        const validateField = (input: HTMLInputElement) => {
          const errorDiv = document.getElementById(`${input.id}Error`) as HTMLDivElement;
          errorDiv.style.display = 'none';
          if (input.value.trim() === '') {
            errorDiv.innerText = `${input.placeholder} is required`;
            errorDiv.style.display = 'block';
          } else {
            const username = (document.getElementById('username') as HTMLInputElement).value;
            const name = (document.getElementById('name') as HTMLInputElement).value;
            const lastname = (document.getElementById('lastname') as HTMLInputElement).value;
            const email = (document.getElementById('email') as HTMLInputElement).value;
            this.employeesService.checkUserExists(name, username, lastname, email).subscribe(
              response => {
                const { name: nameExists, username: usernameExists, lastname: lastnameExists, email: emailExists } = response;
                if (input.id === 'name' && nameExists) {
                  errorDiv.innerText = 'Firstname already exists';
                  errorDiv.style.display = 'block';
                } else if (input.id === 'username' && usernameExists) {
                  errorDiv.innerText = 'Username already exists';
                  errorDiv.style.display = 'block';
                } else if (input.id === 'lastname' && lastnameExists) {
                  errorDiv.innerText = 'Lastname already exists';
                  errorDiv.style.display = 'block';
                } else if (input.id === 'email' && emailExists) {
                  errorDiv.innerText = 'Email already exists';
                  errorDiv.style.display = 'block';
                } else {
                  errorDiv.style.display = 'none';
                }
                checkInputs();
              },
              error => {
                Swal.fire('Error', 'Failed to check user existence', 'error');
              }
            );
          }
        };

        const resetErrorMessages = () => {
          allInputs.forEach(input => {
            const errorDiv = document.getElementById(`${input.id}Error`) as HTMLDivElement;
            errorDiv.style.display = 'none';
            errorDiv.innerText = ''; // clear the error text
          });
        };

        allInputs.forEach(input => {
          input.addEventListener('input', () => {
            resetErrorMessages(); // reset errors when inputs change
            validateField(input); // validate individual input
          });
        });

        const closeCameraButton = document.getElementById('closeCamera') as HTMLButtonElement;

        openCameraButton.addEventListener('click', () => {
          navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
            video.srcObject = stream;
            video.style.display = 'block';
            takePhotoButton.style.display = 'block';
            closeCameraButton.style.display = 'block'; // Show the close camera button
            openCameraButton.style.display = 'none';
          }).catch(error => {
            Swal.fire('Error', 'Unable to access camera', 'error');
          });
        });

        closeCameraButton.addEventListener('click', () => {
          const stream = video.srcObject as MediaStream;
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop()); // Stop all video tracks
          video.style.display = 'none';
          closeCameraButton.style.display = 'none';
          takePhotoButton.style.display = 'none';
          video.srcObject = null; // Reset the video element
          openCameraButton.style.display = 'block';
        });

        takePhotoButton.addEventListener('click', () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          video.style.display = 'none';
          canvas.style.display = 'block';
          pictureTaken = true; // mark picture as taken
          checkInputs(); // recheck inputs to enable the Save button if all criteria are met
        });

        // Initial check to set button state correctly
        checkInputs();
      },
      preConfirm: () => {
        // Stop the video stream
        const video = document.getElementById('video') as HTMLVideoElement;
        if (video.srcObject) {
          const stream = video.srcObject as MediaStream;
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop()); // Stop all video tracks
          video.srcObject = null; // Reset the video element
        }

        const Username = (document.getElementById('username') as HTMLInputElement).value;
        const Name = (document.getElementById('name') as HTMLInputElement).value;
        const Lastname = (document.getElementById('lastname') as HTMLInputElement).value;
        const Email = (document.getElementById('email') as HTMLInputElement).value;
        const Password = (document.getElementById('password') as HTMLInputElement).value;
        const Role = (document.getElementById('role') as HTMLInputElement).value;

        // Get the picture as a Blob
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        return new Promise((resolve, reject) => {
          canvas.toBlob(blob => {
            if (!blob) {
              reject('Failed to capture image');
              return;
            }

            // Create FormData and append all inputs and the captured image
            const formData = new FormData();
            formData.append('username', Username);
            formData.append('name', Name);
            formData.append('lastname', Lastname);
            formData.append('email', Email);
            formData.append('password', Password);
            formData.append('role', Role);
            formData.append('image', blob, 'profile.png');

            resolve(formData);
          });
        });
      },
      willClose: () => {
        // Close the camera when the Swal dialog is closed
        const video = document.getElementById('video') as HTMLVideoElement;
        if (video.srcObject) {
          const stream = video.srcObject as MediaStream;
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop()); // Stop all video tracks
          video.srcObject = null; // Reset the video element
        }
      }
    }).then(result => {
      if (result.isConfirmed) {
        const formData = result.value as FormData;
        this.employeesService.addUserWithFace(formData).subscribe(
          () => {
            Swal.fire('Success', 'User added successfully', 'success').then(() => {
              // Optionally open the camera again here if needed
            });
          },
          error => {
            Swal.fire('Error', 'Failed to add user', 'error');
          }
        );
      }
    });
  }

  resetForm() {
    // Reset the file path inputs
    this.inputFilePathCsvAnalyse = '';
    this.inputFilePathXmlAnalyse = '';

    // Reset output variables for CSV
    this.csvAttributesoutput = '';
    this.nullAttributesoutput = '';
    this.similarAttributesoutput = '';
    this.rowCountoutput = '';
    this.attributeCountoutput = '';

    // Reset output variables for XML
    this.xmlAttributesoutput = '';
    this.nullAttributesoutputxml = '';
    this.similarAttributesoutputxml = '';
    this.similarAttributesoutputxmlFormatted = ''; // Reset the formatted string for XML

    // Reset repeated attributes for XML
    this.repeatedAttributes = [];

    // Reset Mistral API responses
    this.mistralResponse = null;
    this.mistralResponseXml = null;

    // Reset loading and analysis complete states
    this.isLoading = false;
    this.isAnalysisComplete = false;
  }

}
