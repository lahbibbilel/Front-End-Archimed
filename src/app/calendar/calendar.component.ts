import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarService } from './calendar.service';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    weekends: true,
    events: [] // Initialization empty, will be filled by loadUserEvents()
  };







  userId: string; // ID of the authenticated user

  constructor(
    private calendarService: CalendarService,
    private cookieService: CookieService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userId = this.cookieService.get('_id');
    this.loadUserEvents();
  }

  loadUserEvents(): void {
    this.calendarService.getCalendars().subscribe((data: any) => {
      this.calendarOptions.events = data
        .filter((event: any) => event.users.includes(this.userId)) // Filter events based on userId
        .map((event: any) => ({
          id: event._id,
          title: event.tasks,
          start: new Date(event.start_task),
          end: new Date(event.end_task),
          backgroundColor: event.isFinished ? '#28a745' : null,
          extendedProps: {
            isFinished: event.isFinished,
            dateFinished: event.dateFinished
          }
        }));
    });
  }

  markTaskAsFinished(taskId: string): void {
    const dateFinished = new Date();

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to mark this task as finished?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, finish it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.calendarService.markTaskAsFinished(taskId, dateFinished, this.userId).subscribe(
          () => {
            this.toastr.success('Task marked as finished successfully');
            this.loadUserEvents(); // Recharger les événements après avoir marqué la tâche comme terminée
          },
          (error) => {
            console.error('Error marking task as finished:', error);
            this.toastr.error('Error marking task as finished');
            // Gérer l'erreur ici
          }
        );
      }
    });
  }

  canMarkAsFinished(event: any): boolean {
    const currentDate = new Date();
    const start = new Date(event.start);
    const end = new Date(event.end);
    return currentDate >= start && currentDate <= end && !event.extendedProps.isFinished;
  }
  showTaskDetails(event: any): void {
    Swal.fire({
      title: 'Task Details',
      html: `
        <p><b>Title:</b> ${event.title}</p>
        <p><b>Start Date:</b> ${new Date(event.start).toLocaleString()}</p>
        <p><b>End Date:</b> ${new Date(event.end).toLocaleString()}</p>
        <p><b>Status:</b> ${event.extendedProps.isFinished ? 'Finished' : 'Ongoing'}</p>
        <p><b>Finished Date:</b> ${event.extendedProps.dateFinished || 'N/A'}</p>
      `,
      icon: 'info',
      confirmButtonText: 'Close',
      confirmButtonColor: '#3085d6',
      width: '40vw' // Ajuster la largeur de la fenêtre si nécessaire
    });
  }
}
