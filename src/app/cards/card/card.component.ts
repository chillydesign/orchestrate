import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Project } from 'src/app/models/project.model';
import { Task } from 'zone.js/lib/zone-impl';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() task: Task;
  @Input() project: Project;
  // @Input() users: User[];
  @Input() canAdministrate = true;
  @Input() showProjectLink = false;
  @Input() neverShowComments = false;
  public showComments = true;
  @Input() showDate = false;
  @Output() taskDeleted: EventEmitter<Task | null | undefined> = new EventEmitter(undefined);
  @Output() taskUpdated: EventEmitter<Task | null | undefined> = new EventEmitter(undefined);
}
