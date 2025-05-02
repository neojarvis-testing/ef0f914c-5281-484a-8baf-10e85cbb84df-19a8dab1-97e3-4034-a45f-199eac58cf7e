import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import { AdminnavComponent } from './components/adminnav/adminnav.component';
import { AuthGuard } from './components/authguard/authguard.guard';
import { UsernavComponent } from './components/usernav/usernav.component';
import { UseraddfeedbackComponent } from './components/useraddfeedback/useraddfeedback.component';
import { UserviewfeedbackComponent } from './components/userviewfeedback/userviewfeedback.component';
import { CreateinternshipComponent } from './components/createinternship/createinternship.component';
import { RequestedinternshipComponent } from './components/requestedinternship/requestedinternship.component';
import { AdminviewfeedbackComponent } from './components/adminviewfeedback/adminviewfeedback.component';
import { UserviewinternshipComponent } from './components/userviewinternship/userviewinternship.component';
import { UserappliedinternshipComponent } from './components/userappliedinternship/userappliedinternship.component';
import { AdmineditinternshipComponent } from './components/admineditinternship/admineditinternship.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ViewinternshipComponent } from './components/viewinternship/viewinternship.component';
import { InternshipformComponent } from './components/internshipform/internshipform.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'error', component: ErrorComponent },

  // ✅ Admin routes with Admin Navbar
  {
    path: 'admin',
    component: AdminnavComponent, // ✅ Adminnav appears for all admin pages
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'internshiprequested', component: RequestedinternshipComponent },
      { path: 'feedbacks', component: AdminviewfeedbackComponent },
      { path: 'createinternship', component: CreateinternshipComponent },
      { path: 'viewinternship', component: ViewinternshipComponent },
      { path: 'admineditinternship/:internshipId', component: AdmineditinternshipComponent },
    ],
  },

  // ✅ User routes with User Navbar
  {
    path: 'user',
    component: UsernavComponent, // ✅ Usernav appears for all user pages
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'view-internships', component: UserviewinternshipComponent },
      { path: 'applied-internships', component: UserappliedinternshipComponent },
      { path: 'post-feedback', component: UseraddfeedbackComponent },
      { path: 'view-feedbacks', component: UserviewfeedbackComponent },
      { path: 'internshipform/:internshipId', component: InternshipformComponent},
    ],
  },

  // { path: '**', redirectTo: '/error' } // Redirect unknown routes to error page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
