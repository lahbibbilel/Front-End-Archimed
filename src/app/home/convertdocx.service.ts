import { Injectable } from '@angular/core';
import {HttpClient, HttpEventType} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ConvertdocxService {
  private baseUrl = "http://localhost:3001/convertDocToTxt"; // Assurez-vous que l'URL correspond à votre endpoint API

  private apiUrl = 'http://localhost:3001/extract-clean-subfiles';



  constructor(private http: HttpClient) { }

  convertDocxToTxt(input: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, { docxFilePath: input });
  }
  processFiles(inputFilePath: string, subFilesInfo: any[]): Observable<any> {
    return this.http.post<any>(this.apiUrl, { inputFilePath, subFilesInfo });
  }
  private apiUrl2 = 'http://localhost:3001/count-notices';

  countNotices(filePath: string) {
    const url = `${this.baseUrl}/count-notices`;
    return this.http.post<{ recordCount: number }>(url, { filePath });
  }


}
