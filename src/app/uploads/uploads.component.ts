import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Upload } from '../models/upload.model';
import { UploadsService } from '../services/uploads.service';
import { Subscription } from 'rxjs';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.scss']
})
export class UploadsComponent implements OnInit, OnDestroy {
  public uploads: Upload[] = [];
  @Input() project: Project;
  public tasks: Task[];
  public files: File[] = [];
  public failedUploads: File[] = [];
  public uploadingFiles: File[] = [];
  public maxFileSize: number = 1024 * 1024 * 30; // 30 mb
  private new_upl_sub: Subscription;
  private uploads_sub: Subscription;
  constructor(private uploadsService: UploadsService) { }

  ngOnInit() {
    if (this.project) {
      this.uploads = this.project.uploads;
      // this.getUploads();
      this.tasks = this.project.tasks;
    }

  }


  getUploads(): void {
    this.uploads_sub = this.uploadsService.getUploads(this.project.id).subscribe(
      (uploads: Upload[]) => {
        if (uploads) {
          uploads.forEach(u => this.uploads.push(u));
        }
      }
    );
  }


  removeOldUpload(upload: Upload): void {
    this.uploads = this.uploads.filter(u => u.id !== upload.id);

  }



  onSelect(event) {

    const newfiles = event.addedFiles;
    this.files.push(...newfiles);


    this.showFailedUploadsPopup(event.rejectedFiles);


    newfiles.forEach((file: File) => {
      this.readFile(file).then(fileContents => {

        this.uploadingFiles.push(file);

        // SEND FILE TO API
        const new_upload = new Upload({
          file_contents: fileContents.toString(),
          filename: file.name,
          project_id: this.project.id
        });

        this.new_upl_sub = this.uploadsService.addUpload(new_upload).subscribe(
          (upload: Upload) => {
            this.uploads.push(upload);
            // remove it from the ist of currently uplaoding files.
            this.removeFileFromList(file);
          }, (error) => {
            // remove it from the ist of currently uplaoding files.
            this.removeFileFromList(file);
            this.showFailedUploadsPopup([file]);

          }
        );


      }).catch((err) => {
        console.log(err);
      });
    });


  }

  fileIsUploading(file: File): boolean {
    const uploadingNow = true;
    return uploadingNow;
  }



  removeFileFromList(file: File): void {
    this.files.splice(this.files.indexOf(file), 1);
  }

  onRemove(event: File) {

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
      this.new_upl_sub,
      this.uploads_sub
    ];
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }



}
