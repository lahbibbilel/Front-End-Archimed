import { ChatService } from "./chat.service";
import { Component, OnInit } from "@angular/core";
import { LoginService } from "../../authentification/login/login.service";
import { Observable } from "rxjs";
import { io } from "socket.io-client";
import { IMediaRecorder, MediaRecorder } from "extendable-media-recorder";

@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss']
})
export class CallComponent implements OnInit {
  constructor(private getUsers: ChatService, public getAuth: LoginService) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.recorder = new MediaRecorder(stream);
      })
      .catch(error => {
        console.error('Erreur lors de l\'accès à l\'audio:', error);
      });
  }

  users: any[] = [];
  id: any[] = [];
  selectedUser: any = null;
  message: string = '';
  messages: any[] = [];
  sendIt: any[] = [];
  receiver: any[] = [];

  ngOnInit(): void {
    this.getUsers.getUsers().subscribe(
      (users: any[]) => {
        const authUserId = this.getAuth.getId();
        this.users = users.filter(user => user._id !== authUserId);
        console.log(this.users);
        this.id = this.users.map(user => user._id);
        console.log(this.id, "ok3");
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );

    this.getUsers.listenForMessages().subscribe((newMessage: any) => {
      this.messages.push(newMessage);
    });
  }

  getUserEvent(id: any): Observable<any> {
    return this.getUsers.getUserById(id);
  }

  getUserClick(user: any) {
    this.selectedUser = user;
    console.log(this.selectedUser);
    this.getUserMessagesSender(this.getAuth.getId(), user._id);
    this.getMessagesReceiver(user._id, this.getAuth.getId());
  }

  sendMessage(sender: any, receiver: any, message: string) {
    this.getUsers.sendMessage(sender, receiver, message).subscribe(
      (response: any) => {
        const newMessage = {
          senderId: sender,
          receiverId: receiver,
          message: message,
          timestamp: new Date().toISOString()
        };
        this.messages.push(newMessage);
        this.message = '';
        console.log(response);
      }
    );
  }

  getUserMessagesSender(sender: any, receiver: any): void {
    this.getUsers.getMessagesUser(sender, receiver).subscribe(
      (messages: any[]) => {
        this.sendIt = messages;
        this.sortMessages();
        console.log(sender, receiver, 'ici pour messages 1');
        console.log(this.sendIt, 'sender');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getMessagesReceiver(receiver: any, sender: any): void {
    this.getUsers.getMessagesUser(receiver, sender).subscribe(
      (messages: any[]) => {
        this.receiver = messages;
        this.sortMessages();
        console.log(receiver, sender, 'ici pour messages 2');
        console.log(this.receiver, 'receiver');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  sortMessages() {
    this.messages = [...this.sendIt, ...this.receiver];
    this.messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  recorder!: IMediaRecorder;
  webcamStream!: MediaStream;

  startRecording() {
    if (this.recorder && this.recorder.state === 'inactive') {
      const chunks: BlobPart[] = [];

      this.recorder.ondataavailable = (event: BlobEvent) => {
        chunks.push(event.data);
      };

      this.recorder.onstop = () => {
        const blob = new Blob(chunks, { type: this.recorder.mimeType });
      };

      this.recorder.start();
    }
  }

  stopRecording() {
    if (this.recorder && this.recorder.state === 'recording') {
      this.recorder.stop();
    }
  }

  startWebcam() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.webcamStream = stream;
      })
      .catch(error => {
        console.error('Erreur lors de l\'activation de la webcam:', error);
      });
  }

  stopWebcam() {
    if (this.webcamStream) {
      this.webcamStream.getTracks().forEach(track => track.stop());
    }
  }
}
