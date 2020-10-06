import { Injectable } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Observable } from 'rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private url = 'http://127.0.0.1:8081/api/v1';

  constructor(public http: HttpClient, public router: Router) { }

  setUserInfoInLocalStorage = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
  }

  getUserInfoInLocalStorage = () => {
    return JSON.parse(localStorage.getItem('userInfo'));
  }


  public getAlltodo(): any {

    const authToken = Cookie.get('authToken');

    const myResponse = this.http.get(this.url + '/todo/view/all?authToken=' + authToken);
    console.log(myResponse);
    return myResponse;
  }

  public createTodo(item): any {


    const authToken = Cookie.get('authToken');
    const myResponse = this.http.post(this.url + '/todo/create?authToken=' + authToken, item);
    console.log(myResponse);
    return myResponse;
  }


  public delete(todoId): any {

    const authToken = Cookie.get('authToken');
    const myResponse = this.http.post(this.url + '/todo/' + todoId + '/deleteTodo?authToken=' + authToken, todoId);
    console.log(myResponse);

    return myResponse;

  }

  public getPerticularTodo(todoId) {


    const authToken = Cookie.get('authToken');
    const myResponse = this.http.get(this.url + '/todo/' + todoId + '/view?authToken=' + authToken);
    console.log(myResponse);

    return myResponse;

  }

  public edit(todo) {


    console.log(todo.todoId);
    console.log(todo.todo);
    const authToken = Cookie.get('authToken');
    const myResponse = this.http.put(this.url + '/todo/' + todo.todoId + '/edit?authToken=' + authToken, todo);
    console.log(myResponse);

    return myResponse;

  }

}
