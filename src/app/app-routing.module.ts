import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects/projects.component';
import { NotFoundComponent } from './status-codes/not-found/not-found.component';
import { ProjectComponent } from './projects/project/project.component';
import { NewProjectComponent } from './projects/new-project/new-project.component';
import { EditProjectComponent } from './projects/edit-project/edit-project.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { ClientsComponent } from './clients/clients.component';
import { StartPageComponent } from './start-page/start-page.component';



const routes: Routes = [
  { path: '', component: StartPageComponent },
  { path: 'sign_in', component: SignInComponent, data: { title: 'Sign in' } },


  { path: 'projects/status/:status', component: ProjectsComponent, data: { title: 'Projects' } },
  { path: 'projects/new', component: NewProjectComponent, data: { title: 'New Project' } },
  { path: 'projects/:id', component: ProjectComponent },
  { path: 'projects/:id/translate', component: ProjectComponent },
  { path: 'projects/:id/translation', component: ProjectComponent },
  { path: 'projects/:id/admin', component: ProjectComponent },
  { path: 'projects/:id/edit', component: EditProjectComponent, data: { title: 'Edit Project' } },

  { path: 'clients/new', component: ClientsComponent, data: { title: 'New Client' } },
  { path: 'clients/:id', component: ClientsComponent, data: { title: 'Client' } },
  { path: 'clients', component: ClientsComponent, data: { title: 'Clients' } },

  { path: '401', component: NotFoundComponent, data: { title: 'Page not found' } },
  { path: '404', component: NotFoundComponent, data: { title: 'Page not found' } },
  { path: '**', component: NotFoundComponent, data: { title: 'Page not found' } },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


