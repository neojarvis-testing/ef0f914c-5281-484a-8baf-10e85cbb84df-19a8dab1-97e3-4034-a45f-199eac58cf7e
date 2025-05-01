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
 
const routes: Routes = [
  {path: '', component: HomeComponent },
  {path: 'register', component: RegistrationComponent},
  {path: 'login', component: LoginComponent},
  {path: 'error', component: ErrorComponent},
  { path: 'admin', component: AdminnavComponent, canActivate: [AuthGuard] },
  { path: 'user-dashboard', component: UsernavComponent, canActivate: [AuthGuard] },
  { path: 'post-feedback', component: UseraddfeedbackComponent},
  { path: 'view-feedback', component: UserviewfeedbackComponent}
];
 
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }