import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Project } from 'src/app/models/project.model';
import { UploadsService } from 'src/app/services/uploads.service';
import { Upload } from 'src/app/models/upload.model';
import { Subscription } from 'rxjs';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-new-upload',
  templateUrl: './new-upload.component.html',
  styleUrls: ['./new-upload.component.scss']
})
export class NewUploadComponent implements OnInit, OnDestroy {
  @Input() project: Project;
  @Input() task: Task;
  @Output() uploadCreated: EventEmitter<Upload | null | undefined> = new EventEmitter(undefined);

  public uploads: Upload[];
  public files: File[] = [];
  public failedUploads: File[] = [];
  public uploadingFiles: File[] = [];
  public maxFileSize: number = 1024 * 1024 * 30; // 30 mb

  private new_upl_sub: Subscription;
  constructor(private uploadsService: UploadsService) { }

  ngOnInit() {
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


        if (this.task) {
          new_upload.task_id = this.task.id;
        }

        this.new_upl_sub = this.uploadsService.addUpload(new_upload).subscribe(
          (upload: Upload) => {
            this.uploadCreated.next(upload);
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


  removeFileFromList(file: File): void {
    this.files.splice(this.files.indexOf(file), 1);
  }




  showFailedUploadsPopup(failedFiles: File[]): void {
    this.failedUploads = failedFiles;
    const failedTimer = setTimeout(() => {
      this.failedUploads = null;
    }, 5000);
  }


  onRemove(event: File) {

    this.removeFileFromList(event);
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


  fileIsUploading(file: File): boolean {
    const uploadingNow = true;
    return uploadingNow;
  }



  ngOnDestroy() {
    const subs: Subscription[] = [
      this.new_upl_sub,
    ];
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }


}
