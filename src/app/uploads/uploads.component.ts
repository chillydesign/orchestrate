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
  // public uploads: Upload[] = [];
  @Input() project: Project;
  public tasks: Task[];
  // private uploads_sub: Subscription;
  constructor(private uploadsService: UploadsService) { }

  ngOnInit() {
    if (this.project) {

      this.tasks = this.project.tasks;
    }

  }


  // getUploads(): void {
  //   this.uploads_sub = this.uploadsService.getUploads(this.project.id).subscribe(
  //     (uploads: Upload[]) => {
  //       if (uploads) {
  //         uploads.forEach(u => this.uploads.push(u));
  //       }
  //     }
  //   );
  // }


  removeOldUpload(upload: Upload): void {
    this.project.uploads = this.project.uploads.filter(u => u.id !== upload.id);

  }




  ngOnDestroy() {
    const subs: Subscription[] = [
      // this.uploads_sub
    ];
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }


}
