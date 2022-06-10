import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { ProjectsComponent } from './projects/projects.component';
import { NotFoundComponent } from './status-codes/not-found/not-found.component';
import { ProjectComponent } from './projects/project/project.component';
import { NewProjectComponent } from './projects/new-project/new-project.component';
import { EditProjectComponent } from './projects/edit-project/edit-project.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { ClientsComponent } from './clients/clients.component';
import { StartPageComponent } from './start-page/start-page.component';
import { ClientComponent } from './clients/client/client.component';
import { NewClientComponent } from './clients/new-client/new-client.component';
import { TasksComponent } from './tasks/tasks.component';
import { ClientTasksComponent } from './client-tasks/client-tasks.component';
import { SearchComponent } from './search/search.component';



const routes: Routes = [
  { path: '', component: StartPageComponent },
  { path: 'sign_in', component: SignInComponent, data: { title: 'Sign in' } },


  { path: 'projects/status/:status', component: ProjectsComponent, data: { title: 'Projects' } },
  { path: 'projects/new/clients/:client_id', component: NewProjectComponent, data: { title: 'New Project' } },
  { path: 'projects/new', component: NewProjectComponent, data: { title: 'New Project' } },
  { path: 'projects/:id', component: ProjectComponent },
  { path: 'projects/:id/translate', component: ProjectComponent },
  { path: 'projects/:id/translation', component: ProjectComponent },
  { path: 'projects/:id/admin', component: ProjectComponent },
  { path: 'projects/:id/edit', component: EditProjectComponent, data: { title: 'Edit Project' } },
  { path: 'projects', component: ProjectsComponent, data: { title: 'Project' } },
  { path: 'search', component: SearchComponent, data: { title: 'Search' } },

  { path: 'tasks', component: TasksComponent, data: { title: 'Tasks' } },

  { path: 'clients/new', component: NewClientComponent, data: { title: 'New Client' } },
  { path: 'clients/id/:id', component: ClientComponent, data: { title: 'Client' } },
  { path: 'clients/:slug/tasks', component: ClientTasksComponent, data: { title: 'Tasks' } },
  { path: 'clients/:slug', component: ClientComponent, data: { title: 'Client' } },
  { path: 'clients', component: ClientsComponent, data: { title: 'Clients' } },

  { path: '401', component: NotFoundComponent, data: { title: 'Page not found' } },
  { path: '404', component: NotFoundComponent, data: { title: 'Page not found' } },
  { path: '**', component: NotFoundComponent, data: { title: 'Page not found' } },

];

// always scroll to top of page on route change
const routingOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  relativeLinkResolution: 'legacy'
};


@NgModule({
  imports: [RouterModule.forRoot(routes, routingOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


