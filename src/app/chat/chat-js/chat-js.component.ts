import { Component, OnInit } from '@angular/core';
import {ChatJSmlService} from "../chat-jsml.service";

@Component({
  selector: 'app-chat-js',
  templateUrl: './chat-js.component.html',
  styleUrls: ['./chat-js.component.css']
})
export class ChatJSComponent implements OnInit {
  message: string = '';
  date_decision: string = '';
  errorMessage: string = '';
  messages: { text: string, time: string }[] = [];

  constructor(private mlApiService: ChatJSmlService) { }

  ngOnInit(): void {
  }

  sendMessage() {
    // Ajouter le message de l'utilisateur au tableau de messages
    this.messages.push({ text: this.message, time: new Date().toLocaleTimeString() });

    // Appeler le service pour prédire la catégorie du message
    this.mlApiService.predictCategory(this.message).subscribe(
      (response) => {
        this.date_decision = response.date_decision;
        this.errorMessage = '';

        // Ajouter la réponse du bot au tableau de messages
        this.messages.push({ text: this.date_decision, time: new Date().toLocaleTimeString() });
      },
      (error) => {
        this.errorMessage = error.error.error;
        this.date_decision = '';
      }
    );

    // Effacer le champ de saisie après l'envoi du message
    this.message = '';
  }
}
