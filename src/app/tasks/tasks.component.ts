import { Component, OnInit } from '@angular/core';
import { LoginService } from "../authentification/login/login.service";
import { CalendarService } from "../calendar/calendar.service";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  tasks: any[] = [];

  constructor(
    private calendarService: CalendarService,
    private authService: LoginService
  ) { }

  ngOnInit(): void {
    const userId = this.authService.getId(); // Assume this retrieves user ID from AuthService

    this.calendarService.getTasksByUserId(userId)
      .subscribe(
        (tasks: any[]) => {
          // Update tasks with calculated status
          this.tasks = tasks.map(task => ({
            ...task,
            status: this.calculateTaskStatus(task)
          }));
        },
        error => {
          console.error('Error fetching tasks:', error);
          // Handle error if needed
        }
      );
  }

  calculateTaskStatus(task: any): string {
    const currentDate = new Date();
    const endDate = new Date(task.end_task);

    console.log('Current Date:', currentDate);
    console.log('End Date:', endDate);

    if (endDate < currentDate) {
      return 'termine'; // Task is finished if end date is in the past
    } else {
      return 'en_cours'; // Task is ongoing if end date is in the future
    }
  }

}
