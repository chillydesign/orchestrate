import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.scss']
})
export class UploadsComponent implements OnInit {
  public files: File[] = [];

  constructor() { }

  ngOnInit() {
  }


  onSelect(event) {
    console.log(event);
    const newfiles = event.addedFiles;
    this.files.push(...newfiles);

    newfiles.forEach((file: File) => {
      this.readFile(file).then(fileContents => {
        console.log(fileContents);

        // TODO SEND FILE TO API

      }).catch((err) => {
        console.log(err);
      });
    });


  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
    // TODO DELETE FILE FROM API HERE
  }





  private async readFile(file: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = e => {
        return resolve((e.target as FileReader).result);
      };

      reader.onerror = e => {
        console.error(`FileReader failed on file ${file.name}.`);
        return reject(null);
      };

      if (!file) {
        console.error('No file to read.');
        return reject(null);
      }

      reader.readAsDataURL(file);
    });
  }

}
