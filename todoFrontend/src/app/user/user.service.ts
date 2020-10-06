import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = 'http://127.0.0.1:8081/api/v1';
  constructor(public http: HttpClient, public router: Router) { }
  setUserInfoInLocalStorage = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
  }
  getUserInfoInLocalStorage = () => {
   return JSON.parse(localStorage.getItem('userInfo'));
  }
  public signUpFunction(data): Observable<any>{
    const params = new HttpParams()
    .set('firstName', data.firstName)
    .set('lastName', data.lastName)
    .set('mobile', data.mobile)
    .set('email', data.email)
    .set('password', data.password)
    .set('apiKey', data.apiKey);
    return this.http.post(`${this.url}/user/signup`, params);
  }// end of signup function

  public signinFunction(data): Observable<any>{
    const params = new HttpParams()
    .set('email', data.email)
    .set('password', data.password);
    return this.http.post(`${this.url}/user/sign-in`, params);

  }// end of login function

  public logout(): Observable<any> {
    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'));
    return this.http.post(`${this.url}/user/logout`, params);

  } // end logout function

}
