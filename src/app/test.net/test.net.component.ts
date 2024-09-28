import { Component, OnInit } from '@angular/core';
import {NetService} from "../services/.net.service";

@Component({
  selector: 'app-test.net',
  templateUrl: './test.net.component.html',
  styleUrls: ['./test.net.component.css']
})
export class TestNetComponent implements OnInit {

  top100Items: any[]=[];

  constructor(private apiService: NetService) {}

  ngOnInit(): void {

    this.apiService.getTop100Items().subscribe(
      (data:string) => {
        this.top100Items = JSON.parse(data);
        console.log(this.top100Items); // Affiche les éléments récupérés dans la console
      },
      (error) => {
        console.error('Une erreur s\'est produite :', error);
      }
    );

  }
}
