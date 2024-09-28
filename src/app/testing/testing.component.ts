import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChatJSmlService } from "../chat/chat-jsml.service";
import { ProjectService } from "../dashboard/project.service";

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.css']
})
export class TestingComponent implements OnInit {

  message: string = '';
  output: string = '';
  errorMessage: string = '';
  messages: { name: string, text: string, time: string }[] = [];
  projects: string[] = []; // Liste des noms de projets
  selectedProject: string | null = null; // Projet sélectionné
  showProjectDropdown = false;

  constructor(private mlApiService: ChatJSmlService, private http: HttpClient, private projServ: ProjectService) { }

  ngOnInit(): void {
    this.loadProjects();
    const isDarkMode = document.body.classList.contains('dark-mode');
    this.setTheme(isDarkMode ? 'dark' : 'light');
  }

  setTheme(theme: 'dark' | 'light') {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  toggleTheme() {
    if (document.body.classList.contains('dark-mode')) {
      this.setTheme('light');
    } else {
      this.setTheme('dark');
    }
  }

  loadProjects(): void {
    this.projServ.getProjects().subscribe(
      (response: any) => {
        this.projects = response.map(project => project.nom);
        console.log(this.projects, "proj ici");
      },
      (error) => {
        console.error('Error loading projects:', error);
      }
    );
  }

  get isProjectSelected(): boolean {
    return this.selectedProject !== null;
  }

  get isValidProject(): boolean {
    return ['trat', 'jugement'].includes(this.selectedProject ?? '');
  }

  sendMessage() {
    if (!this.isValidProject) {
      return; // Ne pas envoyer le message si le projet n'est pas valide
    }

    // Add the user's message to the messages array
    this.messages.push({ name: 'You', text: this.message, time: new Date().toLocaleTimeString() });

    // Add a placeholder message with animated dots
    const loadingMessage = { name: 'Bot', text: '', time: new Date().toLocaleTimeString() };
    this.messages.push(loadingMessage);

    // Scroll to the latest message
    setTimeout(() => this.scrollToBottom(), 0);

    // Start the animated dots
    let dots = 0;
    const interval = setInterval(() => {
      dots = (dots + 1) % 4;
      loadingMessage.text = 'Chatbot is typing' + '.'.repeat(dots);
    }, 500);

    // Call the service to get the bot's response
    this.mlApiService.ChatLahbib(this.message).subscribe(
      (response) => {
        clearInterval(interval);
        this.output = response.response;
        this.errorMessage = '';

        // Update the placeholder message with the actual bot response
        loadingMessage.text = this.output;

        // Scroll to the latest message
        setTimeout(() => this.scrollToBottom(), 0);
      },
      (error) => {
        clearInterval(interval);
        this.errorMessage = error.error.error;
        this.output = '';
        loadingMessage.text = 'An error occurred. Please try again.';
      }
    );

    // Clear the input field after sending the message
    this.message = '';
  }

  scrollToBottom() {
    const chatContainer = document.querySelector('.msger-chat');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  toggleProjectDropdown() {
    this.showProjectDropdown = !this.showProjectDropdown;
  }
}
