import { Injectable, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnInit {

  public baseUrl ='http://127.0.0.1:8081/'
  socket: SocketIOClient.Socket;


  constructor(public toastr: ToastrManager, public router: Router) {
    this.socket = io.connect(this.baseUrl);
   }

   ngOnInit(){

}

  // events to be listened

  public verifyUser = () => {

    return Observable.create((observer) => {

      this.socket.on('verifyUser', (data) => {

        observer.next(data);

      }); // end Socket

    }); // end Observable

  } // end verifyUser

  public onlineUserList = () => {

    return Observable.create((observer) => {

      this.socket.on('all-onlineUsersList', (userList) => {

        observer.next(userList);

      }); // end Socket

    }); // end Observable

  } // end onlineUserList

  public editButtonClicked = (todo) => {

    this.socket.emit('click', todo);


  } // end onlineUserList

  public notify = () => {

    return Observable.create((observer) => {

      this.socket.on('notify', (todo) => {

        observer.next(todo);

      }); // end Socket

    }); // end Observable

  } // end onlineUserList

  public cameOnline = () => {

    return Observable.create((observer) => {

      this.socket.on('come', (userName) => {

        observer.next(userName);

      }); // end Socket

    }); // end Observable

  } // end onlineUserList


  public authError = () => {

    return Observable.create((observer) => {

      this.socket.on('auth-error', (data) => {

        observer.next(data);

      }); // end Socket

    }); // end Observable

  } // end authError




  public chatByUserId = (userId) => {

    return Observable.create((observer) => {

      this.socket.on(userId, (data) => {

        observer.next(data);

      }); // end Socket

    }); // end Observable

  } // end chatByUserId


  public disconnectedSocket = () => {

      this.socket.emit('disconnect', '');

    } // end Observable
 // end disconnectSocket

  public markChatAsSeen = (userDetails) => {

    this.socket.emit('mark-chat-as-seen', userDetails);

  } // end markChatAsSeen


  // end events to be listened

  // events to be emitted

  public setUser = (authToken) => {

    this.socket.emit('setUser', authToken);

  } // end setUser



  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {

      errorMessage = `An error occurred: ${err.error.message}`;

    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    } // end condition *if

    console.error(errorMessage);

    return Observable.throw(errorMessage);

  }  // END handleError
  public exitSocket = () => {


    this.socket.disconnect();


  }// end exit socket


}
