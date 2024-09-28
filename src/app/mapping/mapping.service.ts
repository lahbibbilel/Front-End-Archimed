import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MappingService {
  private apiUrl = 'http://localhost:5000/items/';


  constructor(private http: HttpClient) { }

  generateCsv(request: any): Observable<any> {
    return this.http.post(`${this.apiUrl}generate-csv`, request);
  }
  generateXml(outputPath: string, selectedAttributes: string[]) {
    const request = {
      OutputPathXml: outputPath,
      SelectedAttributes: selectedAttributes
    };

    return this.http.post<any>(`${this.apiUrl}generate-xml`, request);
  }


}
