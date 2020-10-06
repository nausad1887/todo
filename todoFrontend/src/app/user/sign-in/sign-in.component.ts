
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { Cookie} from 'ng2-cookies/ng2-cookies';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  public email: string;
  public password: string;

  constructor(
    public appService: UserService,
    public router: Router,
    private toastr: ToastrManager,
  ) {

  }

  ngOnInit() {
  }

  public goToSignUp = () => {
    this.router.navigate(['/signup']);
  } // end goToSignUp

  public sendMessageUsingKeypress = (event: any) => {
    if (event.keyCode === 13){
      this.signinFunction();
    }
  }

  public signinFunction = () => {
    if (!this.email) {
      this.toastr.warningToastr('enter email');
    } else if (!this.password) {
      this.toastr.warningToastr('enter password');
    } else {
      const data = {email: this.email, password: this.password};
      this.appService.signinFunction(data)
        .subscribe((apiResponse) => {
          if (apiResponse.status === 200) {
            console.log(apiResponse);
            Cookie.set('authToken', apiResponse.data.authToken);
            Cookie.set('receiverId', apiResponse.data.userDetails.userId);
            Cookie.set('receiverName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);
            this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails);
            this.router.navigate(['/home']);
          } else {
            this.toastr.errorToastr(apiResponse.message);
          }
        }, (err) => {
          this.toastr.errorToastr('some error occured');
        });
    } // end condition
  } // end signinFunction

}




