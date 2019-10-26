import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects/projects.component';
import { NotFoundComponent } from './status-codes/not-found/not-found.component';
import { ProjectComponent } from './projects/project/project.component';
import { NewProjectComponent } from './projects/new-project/new-project.component';
import { EditProjectComponent } from './projects/edit-project/edit-project.component';



const routes: Routes = [
  { path: '', component: ProjectsComponent },
  { path: 'projects/status/:status', component: ProjectsComponent, data: { title: 'Projects' } },
  { path: 'projects/new', component: NewProjectComponent, data: { title: 'New Project' } },
  { path: 'projects/:id', component: ProjectComponent },
  { path: 'projects/:id/edit', component: EditProjectComponent, data: { title: 'Edit Project' } },


  { path: '401', component: NotFoundComponent, data: { title: 'Page not found' } },
  { path: '404', component: NotFoundComponent, data: { title: 'Page not found' } },
  { path: '**', component: NotFoundComponent, data: { title: 'Page not found' } },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


