import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { DragulaModule } from 'ng2-dragula';

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
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewClientComponent } from './clients/new-client/new-client.component';
import { TasksComponent } from './tasks/tasks.component';
import { ClientTasksComponent } from './client-tasks/client-tasks.component';
import { ProjectWholeComponent } from './projects/project-whole/project-whole.component';
import { SearchComponent } from './search/search.component';
import { ExportComponent } from './export/export.component';
import { MoveTaskComponent } from './tasks/move-task/move-task.component';
import { BooleanSelectorComponent } from './shared/boolean-selector/boolean-selector.component';
import { ChannelsComponent } from './channels/channels.component';
import { ChannelComponent } from './channels/channel/channel.component';
import { NewChannelComponent } from './channels/new-channel/new-channel.component';
import { NiceminsPipe } from './pipes/nicemins.pipe';
import { AccountComponent } from './auth/account/account.component';
import { ClientStatsComponent } from './client-stats/client-stats.component';
import { BarChartComponent } from './shared/bar-chart/bar-chart.component';
import { CurrencyPipe } from './pipes/currency.pipe';

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
    ProjectSummaryComponent,
    DashboardComponent,
    NewClientComponent,
    TasksComponent,
    ClientTasksComponent,
    ProjectWholeComponent,
    SearchComponent,
    ExportComponent,
    MoveTaskComponent,
    BooleanSelectorComponent,
    ChannelsComponent,
    ChannelComponent,
    NewChannelComponent,
    NiceminsPipe,
    AccountComponent,
    ClientStatsComponent,
    BarChartComponent,
    CurrencyPipe
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    // DragulaModule.forRoot(),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
