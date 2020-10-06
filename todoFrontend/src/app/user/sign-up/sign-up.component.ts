import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { UserService } from '../user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  public firstName: string;
  public lastName: string;
  public mobile: string;
  public email: string;
  public password: string;
  public apiKey: string;

  constructor(public appService: UserService, public router: Router, private toastr: ToastrManager) { }
  ngOnInit() {
  }
  public goToSignIn = () => {
    this.router.navigate(['/']);
  } // end goToSignIn

  public signupFunction = () => {
    if (!this.firstName) {
      this.toastr.warningToastr('enter first name');
    } else if (!this.lastName) {
      this.toastr.warningToastr('enter last name');
    } else if (!this.mobile) {
      this.toastr.warningToastr('enter mobile');
    } else if (!this.email) {
      this.toastr.warningToastr('enter email');
    } else if (!this.password) {
      this.toastr.warningToastr('enter password');
    } else if (!this.apiKey) {
      this.toastr.warningToastr('Enter your API key');
    } else {
      const data = {
        firstName: this.firstName,
        lastName: this.lastName,
        mobile: this.mobile,
        email: this.email,
        password: this.password,
        apiKey: this.apiKey
      };
      console.log(data);
      this.appService.signUpFunction(data)
        .subscribe((apiResponse) => {
          console.log(apiResponse);
          if (apiResponse.status === 200) {
            this.toastr.successToastr('Signup successfull');
            setTimeout(() => {this.goToSignIn(); }, 2000);
          } else {
            this.toastr.errorToastr(apiResponse.message);
          }
        }, (err) => {
          this.toastr.errorToastr('some error occured');
        });
    } // end condition
  } // end signupFunction
}

