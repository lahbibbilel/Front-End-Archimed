// Importez Renderer2 pour manipuler les classes CSS
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chat-users',
  templateUrl: './chat-users.component.html',
  styleUrls: ['./chat-users.component.css']
})
export class ChatUsersComponent implements OnInit {
  @ViewChild('chatBox') chatBox!: ElementRef<HTMLDivElement>;
  @ViewChild('userInput') userInput!: ElementRef<HTMLInputElement>;
//@ViewChild('activate') activate! : ElementRef<HTMLDivElement>;
  constructor(private http: HttpClient, private renderer: Renderer2) { }
 activate!  : false

  ngOnInit(): void {
    // Initialize component
  }

  sendMessage(): void {
    const message = this.userInput.nativeElement.value.trim();
    if (message !== '') {
      this.appendMessage('user', message);
      this.userInput.nativeElement.value = '';
      this.sendRequest(message);
    }
  }
  verif: boolean = true; // Déclarer la variable verif et initialiser à false

  sendRequest(message: string): void {
    const payload = { content: message };
    // Ajoutez la classe CSS 'typing' pour démarrer l'animation
    const chatBubble = this.chatBox.nativeElement.querySelector('.chat-bubble');
  //  this.renderer.addClass(chatBubble, 'typing');

    this.http.post<any>('http://localhost:3000/invokeLLM', payload).subscribe(
      (response) => {
        const botResponse = response.response; // Assuming the response structure contains a 'response' field
        this.appendMessage('bot', botResponse);
        this.verif = false;
        // Supprimez la classe CSS 'typing' pour arrêter l'animation
        this.renderer.removeClass(chatBubble, 'typing');
      },
      (error) => {
        console.error('Error:', error);
        // En cas d'erreur, supprimez également la classe CSS 'typing'
        this.renderer.removeClass(chatBubble, 'typing');
      }
    );
  }

  appendMessage(sender: string, message: string): void {
    const p = document.createElement('p');
    p.textContent = `${sender}: ${message}`;
    if (this.chatBox) {
      this.chatBox.nativeElement.appendChild(p);
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    }
  }
}
