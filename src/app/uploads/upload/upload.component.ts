import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Upload } from 'src/app/models/upload.model';
import { Subscription } from 'rxjs';
import { UploadsService } from 'src/app/services/uploads.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit, OnDestroy {
  @Input() upload: Upload;
  @Output() uploadDeleted: EventEmitter<Upload | null | undefined> = new EventEmitter(undefined);
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



  ngOnDestroy() {
    const subs: Subscription[] = [
      this.delete_upload_sub,
    ];
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }



}
