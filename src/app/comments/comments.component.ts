import { Component, HostListener, EventEmitter, Output, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Comment } from '../models/comment.model';
import { Task } from '../models/task.model';
import { CommentsService } from '../services/comments.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit, OnDestroy {
  @Input() task: Task;
  public newcomment: Comment;
  public comments: Comment[];
  private comments_sub: Subscription;
  private add_comment_sub: Subscription;
  @Output() hide_lightbox: EventEmitter<boolean | null | undefined> = new EventEmitter(undefined);

  constructor(private commentsService: CommentsService) { }

  ngOnInit(): void {



    if (this.task) {
      this.getComments();
      this.resetNewComment();
    }
  }




  getComments(): void {

    this.comments_sub = this.commentsService.getComments(this.task.id).subscribe(
      (comments: Comment[]) => {
        if (comments) {
          this.comments = comments;
        }
      }
    );

  }



  onSubmit(): void {

    this.add_comment_sub = this.commentsService.addComment(this.newcomment).subscribe(
      (comment: Comment) => {

        if (comment) {
          this.comments.push(comment);
          this.resetNewComment();
        }

      },
      (error) => console.log(error)
    );

  }

  resetNewComment(): void {
    this.newcomment = new Comment();
    this.newcomment.task_id = this.task.id;
  }



  saveCommentOnEnter(event): boolean {
    if (event.key === 'Enter') {

      this.onSubmit();
      return false;
    }
  }


  hideLightbox(): void {
    this.hide_lightbox.next(true);
  }



  // on press enter, call checkQuestion or moveToNextQuestionOrSummary
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.hideLightbox();
    }
  }




  ngOnDestroy() {
    const subs: Subscription[] = [
      this.comments_sub,
      this.add_comment_sub,
    ];
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }

}
