import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  constructor() { }


  downloadCSVFromString(output: string, filename: string): void {
    const blob = new Blob(['\ufeff' + output], { type: 'text/csv;charset=utf-8;' });
    const dwldLink = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const isSafariBrowser = navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1;
    // if Safari open in new window to save file with random filename.
    if (isSafariBrowser) {
      dwldLink.setAttribute('target', '_blank');
    }
    dwldLink.setAttribute('href', url);
    const date = new Date();
    const date_string = date.toLocaleDateString();
    const hour = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    dwldLink.setAttribute('download', `${filename}_${date_string}_${hour}_${minutes}.csv`);
    dwldLink.style.visibility = 'hidden';
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      URL.revokeObjectURL(url);
    }, 100);

  }
}
