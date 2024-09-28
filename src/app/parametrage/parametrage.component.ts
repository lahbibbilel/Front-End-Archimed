import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import * as Papa from 'papaparse';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2'; // Importer le service
import { MatMenuTrigger } from '@angular/material/menu';
import jsPDF from "jspdf";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-parametrage',
  templateUrl: './parametrage.component.html',
  styleUrls: ['./parametrage.component.css']
})
export class ParametrageComponent implements AfterViewInit {
  displayedColumns: string[] = ['position', 'mappingSyracus', 'subfield'];
  dataSource = new MatTableDataSource<any>([]);
  headers: string[] = [];
  showDownloadButton: boolean = false;
  selectedType: string = ''; // Champ pour stocker le type sélectionné
  showChatButton: boolean = false; // To control chat button visibility

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatMenuTrigger) chatMenu!: MatMenuTrigger;


  marcOptions: string[] = ['000', '001', '003', '005', '010', '011', '012', '013', '014', '015', '016', '017', '018', '020', '021', '022', '029', '033', '035', '036', '040', '071', '072', '073', '100', '101', '102', '105', '106', '110', '111', '115', '116', '117', '120', '121', '122', '123', '124', '125', '126', '127', '128', '130', '131', '135', '140', '141', '145', '146', '181', '182', '183', '200', '203', '204', '205', '206', '207', '208', '210', '211', '214', '215', '225', '230', '231', '251', '283', '300', '301', '302', '303', '304', '305', '306', '307', '308', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '322', '323', '324', '325', '326', '327', '328', '330', '332', '333', '334', '335', '336', '337', '338', '345', '346', '359', '371', '410', '411', '412', '413', '421', '422', '423', '424', '425', '430', '431', '432', '433', '434', '435', '436', '437', '440', '441', '442', '443', '444', '445', '446', '447', '448', '451', '452', '453', '454', '455', '456', '461', '462', '463', '464', '470', '481', '482', '488', '500', '501', '503', '506', '507', '510', '511', '512', '513', '514', '515', '516', '517', '518', '520', '530', '531', '532', '540', '541', '545', '560', '576', '577', '600', '601', '602', '604', '605', '606', '607', '608', '610', '615', '616', '620', '621', '623', '626', '631', '632', '660', '661', '670', '675', '676', '680', '686', '700', '701', '702', '703', '710', '711', '712', '713', '716', '720', '721', '722', '723', '730', '740', '741', '742', '801', '802', '830', '850', '852', '856', '886', '915', '916', '917', '919', '920', '930', '931', '932', '955', '956', '957', '958', '990', '991', '992', '995'];
  unimarcOptions: string[] = ['000', '001', '003', '005', '010', '011', '012', '013', '014', '015', '016', '017', '018', '020', '021', '022', '029', '033', '035', '036', '040', '071', '072', '073', '100', '101', '102', '105', '106', '110', '111', '115', '116', '117', '120', '121', '122', '123', '124', '125', '126', '127', '128', '130', '131', '135', '140', '141', '145', '146', '181', '182', '183', '200', '203', '204', '205', '206', '207', '208', '210', '211', '214', '215', '225', '230', '231', '251', '283', '300', '301', '302', '303', '304', '305', '306', '307', '308', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '322', '323', '324', '325', '326', '327', '328', '330', '332', '333', '334', '335', '336', '337', '338', '345', '346', '359', '371', '410', '411', '412', '413', '421', '422', '423', '424', '425', '430', '431', '432', '433', '434', '435', '436', '437', '440', '441', '442', '443', '444', '445', '446', '447', '448', '451', '452', '453', '454', '455', '456', '461', '462', '463', '464', '470', '481', '482', '488', '500', '501', '503', '506', '507', '510', '511', '512', '513', '514', '515', '516', '517', '518', '520', '530', '531', '532', '540', '541', '545', '560', '576', '577', '600', '601', '602', '604', '605', '606', '607', '608', '610', '615', '616', '620', '621', '623', '626', '631', '632', '660', '661', '670', '675', '676', '680', '686', '700', '701', '702', '703', '710', '711', '712', '713', '716', '720', '721', '722', '723', '730', '740', '741', '742', '801', '802', '830', '850', '852', '856', '886', '915', '916', '917', '919', '920', '930', '931', '932', '955', '956', '957', '958', '990', '991', '992', '995'];
  subfieldOptions: string[] = ['$a', '$b', '$c', '$d', '$e', '$f', '$g', '$h', '$i', '$j', '$k', '$l', '$m', '$n', '$o', '$p', '$q', '$r', '$s', '$t', '$u', '$v', '$w', '$x', '$y', '$z'];
  constructor(private dataService: DataService, private http: HttpClient) {
    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openSweetAlert() {
    Swal.fire({
      title: 'Upload File',
      html: `<input type="file" id="file" class="swal2-input" accept=".csv">`,
      focusConfirm: false,
      showCancelButton: true, // Show the "Close" button
      confirmButtonText: 'Add', // Change "Save" to "Add"
      cancelButtonText: 'Close', // Add a "Close" button
      preConfirm: () => {
        const fileInput = document.getElementById('file') as HTMLInputElement;
        const file = fileInput?.files?.[0];
        if (file) {
          return new Promise((resolve) => {
            Papa.parse(file, { complete: (results) => resolve(results.data) });
          });
        } else {
          Swal.showValidationMessage('Please select a file.');
          return null;
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const data = result.value as string[][];
        this.processCSVData(data);
      }
      // Optionally, handle the cancel action if needed
    });
  }

  processCSVData(data: string[][]) {
    if (data && data.length > 0) {
      const headersString = data[0].join(',');
      this.headers = headersString.split(',');
      const tableData = this.headers.map((header) => ({
        position: header, type: this.selectedType, mappingSyracus: '', subfield: ''
      }));
      this.dataSource = new MatTableDataSource<any>(tableData);
      this.dataSource.paginator = this.paginator;
      this.showDownloadButton = true; // Mettre à true lorsque les données sont disponibles
      this.showChatButton = true; // Afficher le bouton de chat
    }
  }

  saveData() {
    const tableData = this.dataSource.data;
    this.dataService.addData(tableData).subscribe(response => {
      console.log('Données enregistrées', response);
    }, error => {
      console.error('Erreur lors de l\'enregistrement des données', error);
    });
  }

  downloadPDF() {
    if (this.dataSource.data.length > 0) {
      const content = [
        'Headers',
        this.headers.join('\n'),
        'Data',
        this.dataSource.data.map(row => `${row.position} : ${row.mappingSyracus}`).join('\n')
      ];
      const documentDefinition = { content };
      pdfMake.createPdf(documentDefinition).download('headers.pdf');
    } else {
      console.error('Aucune donnée disponible pour le téléchargement.');
    }
  }

  onTypeChange() {
    this.dataSource.data.forEach(row => row.type = this.selectedType);
    if (this.selectedType === 'Marc' || this.selectedType === 'Unimarc 21') {
      this.displayedColumns = ['position', 'mappingSyracus', 'subfield'];
   //   this.fetchLLMData();
    } else {
      this.displayedColumns = ['position']; // Masquer les colonnes spécifiques
    }
  }

  getMappingOptions(type: string): string[] {
    return type === 'Unimarc 21' ? this.marcOptions : (type === 'Marc' ? this.unimarcOptions : []);
  }

  isLoading: boolean = false;

 /* onChatClick() {
    this.isLoading = true; // Show the loading dots
    this.fetchLLMData();
  }*/

 /* fetchLLMData() {
    const content = this.headers.join(',');
    this.http.post<{ response: string }>('http://localhost:3005/invokeLLMParametre', { content, type: this.selectedType })
      .subscribe(response => {
        const data = this.parseLLMResponse(response.response);
        this.dataSource.data = this.dataSource.data.map((row, index) => ({
          ...row,
          mappingSyracus: data[index]?.mappingSyracus || '',
          subfield: data[index]?.subfield || ''
        }));

        this.isLoading = false; // Hide the loading dots

        // SweetAlert with scrollable content
        Swal.fire({
          title: 'LLM Response Received',
          html: '<div class="scrollable-content">The data has been successfully updated.</div>',
          icon: 'success',
          customClass: {
            popup: 'swal-wide'
          }
        });
      }, error => {
        console.error('Erreur lors de l\'appel à LLM', error);
        this.isLoading = false; // Hide the loading dots in case of an error
      });
  }

  parseLLMResponse(response: string): { mappingSyracus: string, subfield: string }[] {
    return response.split('\n').map(line => {
      const [mappingSyracus, subfield] = line.split(',');
      return { mappingSyracus, subfield };
    });
  }
*/
  downloadCSV() {
    if (this.dataSource.data.length > 0) {
      // Define headers
      const headers = ['Fields in headers', 'Mapping Syracus', 'Subfield'];

      // Prepare data for the sheet
      const data = this.dataSource.data.map(row => [
        row.position,
        row.mappingSyracus,
        row.subfield
      ]);

      // Add headers at the top of the data
      const worksheetData = [headers, ...data];

      // Create a worksheet
      const ws = XLSX.utils.aoa_to_sheet(worksheetData);

      // Apply styles to headers
      ws['!cols'] = [
        { width: 20 }, // Adjust column width as needed
        { width: 20 },
        { width: 20 }
      ];
      ws['A1'].s = {
        font: { bold: true, sz: 14 } // Bold and larger font size for header
      };
      ws['B1'].s = ws['A1'].s;
      ws['C1'].s = ws['A1'].s;

      // Create a new workbook and append the worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data');

      // Generate Excel file and trigger download
      XLSX.writeFile(wb, 'data.xlsx');
    } else {
      console.error('Aucune donnée disponible pour le téléchargement.');
    }
  }
  toggleChat() {
    if (this.chatMenu) {
      this.chatMenu.toggleMenu();
    } else {
      console.error('chatMenu is not defined');
    }
  }
  downloadLLMResponse() {
    this.isLoading = true; // Show the loading dots

    this.http.post<{ response: string }>('http://localhost:3005/invokeLLMParametre', {
      content: this.headers.join(','),
      type: this.selectedType
    }).subscribe(response => {
      const responseContent = response.response; // Use the LLM response directly

      Swal.fire({
        title: 'LLM Response Content',
        html: `<div id="scrollable-content" style="max-height: 400px; overflow-y: auto; text-align: left;">${responseContent}</div>`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Download PDF',
        cancelButtonText: 'Cancel',
        customClass: {
          popup: 'swal-wide'
        }
      }).then((result) => {
        this.isLoading = false; // Hide the loading dots

        if (result.isConfirmed) {
          // Create a PDF document
          const doc = new jsPDF();
          const title = 'LLM Response Content';

          // Set font styles for title
          doc.setFontSize(18);
          doc.setFont('helvetica', 'bold');
          doc.text(title, 105, 20, { align: 'center' });

          // Add response content to the PDF
          doc.setFontSize(12);
          doc.setFont('helvetica', 'normal');
          doc.text(responseContent, 10, 30, { maxWidth: 190 });

          // Save the PDF
          doc.save('llm_response.pdf');
        }
      });
    }, error => {
      console.error('Erreur lors de l\'appel à LLM', error);
      this.isLoading = false; // Hide the loading dots in case of an error
    });
  }
  showChatOptions() {
    Swal.fire({
      title: 'Options',
      text: 'Show options here.',
      icon: 'info',
    });
  }
}
