import { Component, OnInit, OnDestroy } from '@angular/core';
import { Upload } from '../models/upload.model';
import { UploadsService } from '../services/uploads.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.scss']
})
export class UploadsComponent implements OnInit, OnDestroy {
  public uploads: Upload[] = [];
  public files: File[] = [];
  public failedUploads: File[] = [];
  public maxFileSize: number = 1024 * 1024 * 100; // 100 mb
  private new_upl_sub: Subscription;
  constructor(private uploadsService: UploadsService) { }

  ngOnInit() {
  }


  onSelect(event) {
    console.log(event);
    const newfiles = event.addedFiles;
    this.files.push(...newfiles);


    this.showFailedUploadsPopup(event.rejectedFiles);


    newfiles.forEach((file: File) => {
      this.readFile(file).then(fileContents => {

        // TODO SEND FILE TO API
        const new_upload = new Upload();
        new_upload.file_contents = fileContents.toString();
        new_upload.filename = file.name;
        this.new_upl_sub = this.uploadsService.addUpload(new_upload).subscribe(
          (upload: Upload) => {
            this.uploads.push(upload);
          }, (error) => {
            // remove it from the ist of currently uplaoding files.
            this.removeFileFromList(file);

          }
        );

        // http://webeasystep.com/blog/view_article/How_to_upload_base64_file_in_PHP

      }).catch((err) => {
        console.log(err);
      });
    });


  }


  removeFileFromList(file: File): void {
    this.files.splice(this.files.indexOf(file), 1);
  }

  onRemove(event: File) {
    console.log(event);
    this.removeFileFromList(event);
    // TODO DELETE FILE FROM API HERE
  }


  showFailedUploadsPopup(failedFiles: File[]): void {
    this.failedUploads = failedFiles;
    const failedTimer = setTimeout(() => {
      this.failedUploads = null;
    }, 5000);
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




  ngOnDestroy() {
    const subs: Subscription[] = [
      this.new_upl_sub
    ];
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }



}
