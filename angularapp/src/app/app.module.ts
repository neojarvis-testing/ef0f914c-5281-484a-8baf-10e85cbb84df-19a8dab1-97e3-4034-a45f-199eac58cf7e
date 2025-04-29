import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UseraddfeedbackComponent } from './components/useraddfeedback/useraddfeedback.component';
import { UsernavComponent } from './components/usernav/usernav.component';
import { FormsModule } from '@angular/forms';
import { UserappliedinternshipComponent } from './components/userappliedinternship/userappliedinternship.component';

@NgModule({
  declarations: [
    AppComponent,
    UseraddfeedbackComponent,
    UsernavComponent,
    UserappliedinternshipComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
