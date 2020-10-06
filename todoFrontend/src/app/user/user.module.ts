import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ng6-toastr-notifications';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from './user.service';



@NgModule({
  declarations: [SignUpComponent, SignInComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ToastrModule.forRoot(),
    RouterModule.forChild([
      {path: 'signup', component: SignUpComponent},
    ])
  ],
  providers:[UserService]
})
export class UserModule { }
