import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { Commentt } from 'src/app/models/comment.model';
import { CommentsService } from 'src/app/services/comments.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent implements OnInit {
  public comment_id: number;
  public comment: Commentt;
  private route_params_subscription: Subscription;
  public formLoading = false;
  public formSuccess = false;
  public canSubmitForm = false;
  public errors: Subject<object> = new Subject();
  private get_sub: Subscription;
  private update_sub: Subscription;
  private del_sub: Subscription;
  constructor(
    private commentsService: CommentsService,
    private route: ActivatedRoute,
  ) {

  }

  ngOnInit() {

    this.subscribeToRoute();
  }

  subscribeToRoute(): void {
    this.route_params_subscription = this.route.params.subscribe(
      (params: Params) => {
        this.comment_id = params.id;
        this.getComment();

      }
    );

  }



  getComment(): void {
    this.get_sub = this.commentsService.getComment(this.comment_id).subscribe({
      next: (comment: Commentt) => {
        this.comment = comment;
      }
    })
  }



  onFormChange(): void {

  }

  onSubmit(): void {


    this.formLoading = true;

    this.update_sub = this.commentsService.updateComment(this.comment).subscribe({
      next: (comment: Commentt) => {
        this.formLoading = false;
        this.formSuccess = true;
        this.errors.next(null);

      },
      error: (error) => {
        this.errors.next(error.error);
        this.formLoading = false;
        this.formSuccess = false;
      }
    })

  }

  ngOnDestroy() {
    const subs: Subscription[] = [
      this.route_params_subscription,
      this.get_sub,
      this.update_sub,
      this.del_sub,
    ];
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });

  }

}
