import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Upload } from 'src/app/models/upload.model';
import { Subscription } from 'rxjs';
import { UploadsService } from 'src/app/services/uploads.service';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit, OnDestroy {
  @Input() upload: Upload;
  @Input() tasks: Task[];
  public updating = false;
  public showSelect = false;
  public show_image = false;
  @Output() uploadDeleted: EventEmitter<Upload | null | undefined> = new EventEmitter(undefined);
  private update_upload_sub: Subscription;
  private delete_upload_sub: Subscription;
  constructor(private uploadsService: UploadsService) { }

  ngOnInit() {
  }


  deleteUpload(): void {

    if (confirm('Are you sure?')) {
      this.delete_upload_sub = this.uploadsService.deleteUpload(this.upload).subscribe(
        () => {
          this.uploadDeleted.next(this.upload);
        },
        (error) => {

        }
      );
    }
  }

  taskChanged(): void {
    this.onSubmit();
  }

  openImage(): void {
    this.show_image = !this.show_image;
  }

  onSubmit(): void {
    // dont do an update til the last update has finished
    if (this.updating === false) {
      this.updating = true;
      this.update_upload_sub = this.uploadsService.updateUpload(this.upload).subscribe(
        (upload: Upload) => {
          this.upload = upload;
          this.updating = false;
        },
        (error) => {

        }
      );
    }
  }


  toggleShowSelect(): void {
    this.showSelect = !this.showSelect;
  }


  ngOnDestroy() {
    const subs: Subscription[] = [
      this.delete_upload_sub,
      this.update_upload_sub,
    ];
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }



}
