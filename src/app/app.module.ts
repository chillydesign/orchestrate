import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DragulaModule } from 'ng2-dragula';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SiteNavigationComponent } from './site-navigation/site-navigation.component';
import { ProjectsComponent } from './projects/projects.component';
import { NotFoundComponent } from './status-codes/not-found/not-found.component';
import { ProjectComponent } from './projects/project/project.component';
import { NewProjectComponent } from './projects/new-project/new-project.component';
import { BoxComponent } from './shared/box/box.component';
import { FormFieldComponent } from './shared/form-field/form-field.component';
import { EditProjectComponent } from './projects/edit-project/edit-project.component';
import { TaskComponent } from './tasks/task/task.component';
import { NewTaskComponent } from './tasks/new-task/new-task.component';
import { BoxFooterComponent } from './shared/box-footer/box-footer.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { UploadsComponent } from './uploads/uploads.component';
import { UploadComponent } from './uploads/upload/upload.component';
import { TranslatePipe } from './pipes/translate.pipe';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { NewUploadComponent } from './uploads/new-upload/new-upload.component';
import { CommentsComponent } from './comments/comments.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { ClientsComponent } from './clients/clients.component';
import { StartPageComponent } from './start-page/start-page.component';
import { ClientComponent } from './clients/client/client.component';
import { ProjectSummaryComponent } from './projects/project-summary/project-summary.component';

@NgModule({
  declarations: [
    AppComponent,
    SiteNavigationComponent,
    ProjectsComponent,
    NotFoundComponent,
    ProjectComponent,
    NewProjectComponent,
    BoxComponent,
    FormFieldComponent,
    EditProjectComponent,
    TaskComponent,
    NewTaskComponent,
    BoxFooterComponent,
    AutofocusDirective,
    UploadsComponent,
    UploadComponent,
    TranslatePipe,
    SpinnerComponent,
    NewUploadComponent,
    CommentsComponent,
    SignInComponent,
    ClientsComponent,
    StartPageComponent,
    ClientComponent,
    ProjectSummaryComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    DragulaModule.forRoot(),
    NgxDropzoneModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
