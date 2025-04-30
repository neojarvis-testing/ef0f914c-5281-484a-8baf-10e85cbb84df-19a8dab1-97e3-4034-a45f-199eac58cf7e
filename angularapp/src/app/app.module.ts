import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';
import { ErrorComponent } from './components/error/error.component';
import { HomeComponent } from './components/home/home.component';
import { AdminnavComponent } from './components/adminnav/adminnav.component';
import { AdmineditinternshipComponent } from './components/admineditinternship/admineditinternship.component';
import { AdminviewfeedbackComponent } from './components/adminviewfeedback/adminviewfeedback.component';
import { CreateinternshipComponent } from './components/createinternship/createinternship.component';
import { InternshipformComponent } from './components/internshipform/internshipform.component';
import { InternshippiechartComponent } from './components/internshippiechart/internshippiechart.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { RequestedinternshipComponent } from './components/requestedinternship/requestedinternship.component';
import { UserviewfeedbackComponent } from './components/userviewfeedback/userviewfeedback.component';
import { UserviewinternshipComponent } from './components/userviewinternship/userviewinternship.component';
import { ViewinternshipComponent } from './components/viewinternship/viewinternship.component';
import { UsernavComponent } from './components/usernav/usernav.component';
import { UseraddfeedbackComponent } from './components/useraddfeedback/useraddfeedback.component';
import { UserappliedinternshipComponent } from './components/userappliedinternship/userappliedinternship.component';
@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    HomeComponent,
    AdminnavComponent,
    AdmineditinternshipComponent,
    AdminviewfeedbackComponent,
    CreateinternshipComponent,
    InternshipformComponent,
    InternshippiechartComponent,
    LoginComponent,
    NavbarComponent,
    RegistrationComponent,
    RequestedinternshipComponent,
    UseraddfeedbackComponent,
    UserappliedinternshipComponent,
    UsernavComponent,
    UserviewfeedbackComponent,
    UserviewinternshipComponent,
    ViewinternshipComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    HttpClientModule,

    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
