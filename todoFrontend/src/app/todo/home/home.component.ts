import { Component, OnInit } from '@angular/core';
import { TodoService } from '../todo.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { style, trigger, transition, animate, keyframes } from '@angular/animations';
import { MatDialog, MatDialogConfig } from "@angular/material"
import { EditComponent } from "../edit/edit.component"
import { UserService } from 'src/app/user/user.service';
import { SocketService } from '../socket.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger("moveInLeft", [
      transition("void=> *", [style({ transform: "translateX(300px)" }),
      animate(200, keyframes([
        style({ transform: "translateX(300px)" }),
        style({ transform: "translateX(0)" })

      ]))]),


      transition("*=>void", [style({ transform: "translateX(0px)" }),
      animate(100, keyframes([
        style({ transform: "translateX(0px)" }),
        style({ transform: "translateX(300px)" })

      ]))])

    ])

  ]
})
export class HomeComponent implements OnInit {

  public authToken: any
  public receiverName: String
  public receiverId: String
  public userFullName: String;
  public p: number = 1;
  public currentTodo;
  public allTodo = [];
  public newItem;
  public userLists: any[];
  public notificationArray = []


  constructor(
    public userService: UserService,
    public appService: TodoService,
    public toastr: ToastrManager,
    public router: Router,
    public socket: SocketService,
    private dialog: MatDialog) {

    this.authToken = Cookie.get('authToken')
    this.receiverId = Cookie.get('receiverId')
    this.receiverName = Cookie.get('receiverName')

  }

  ngOnInit() {

    this.checkStatus()

    this.verifyUserConfirmation()
    console.log(this.userLists)
    this.getAllTodos();
    this.notification()

    this.userFullName = Cookie.get('receiverName').toUpperCase()
    console.log(this.userFullName)

  }

  // checking my status, that my authToken is present in cookies or not
  public checkStatus: any = () => {

    if (Cookie.get('authToken') === undefined || Cookie.get('authToken') === '' || Cookie.get('authToken') === null) {

      this.router.navigate(['/']);

      return false;

    } else {

      return true;

    }

  } // end checkStatus

  public verifyUserConfirmation: any = () => {

    this.socket.verifyUser()
      .subscribe((data) => {


        //setting me as online
        this.socket.setUser(this.authToken);
        //calling list of users function
        this.cameOnline()
        this.getOnlineUserList()


      });
  }

  public cameOnline: any = () => {

    this.socket.cameOnline().subscribe(
      userName => {
        setTimeout(() => {
          this.toastr.successToastr(userName + ' came online')
          console.log(userName + ' came online')
        }, 2000)
      }
    )
  }


  public notification() {

    this.socket.notify().subscribe(
      data => {
        console.log(data)
        this.notificationArray = data

        setTimeout(() => {
          this.toastr.successToastr('A todo just edited by ' + this.notificationArray[0].user + ' in his side', 'Yeah')
        }, 2000)

      }
    )

  }


  public onRemove() {
    // var removeIndex = this.notificationArray.map(function (user) { return user; }).indexOf(this.notificationArray);
    return this.notificationArray.splice(0, 1)
  }




  public getOnlineUserList: any = () => {

    this.socket.onlineUserList()
      .subscribe((userList) => {

        this.userLists = [];

        for (let x of userList) {

          let temp = { 'userId': x.userId, 'name': x.fullName, 'unread': 0, 'chatting': false };

          this.userLists.push(temp)



        }

        console.log(this.userLists);

      }); // end online-user-list
  }

  public getAllTodos() {
    this.appService.getAlltodo()
      .subscribe(
        data => {
          console.log(data)
          this.allTodo = data['data'];
          console.log(this.allTodo);
        },
        error => {
          console.log(error.message);
        });
  }



  public addItem() {
    let data = {
      todo: this.newItem
    }

    this.newItem = ''

    this.appService.createTodo(data).subscribe(
      data => {
        console.log(data)
        this.toastr.successToastr('TodoCreatedSuccessfully', 'Yeah');

        this.getAllTodos()

      },
      error => {
        console.log(error.message);
        this.toastr.errorToastr('Some Error Occurred while creating Todo', 'Oops!');
      })
  }


  public delete(id) {

    this.appService.delete(id).subscribe(
      data => {

        console.log(data)
        this.getAllTodos()
        this.toastr.successToastr('TodoDeletedSuccessfully', 'Yeah');
      },
      error => {
        console.log(error.message);
        this.toastr.errorToastr('Some Error Occurred while deleting Todo', 'Oops!');
      })
  }


  public goToLogOut() {

    this.userService.logout().subscribe(
      data => {

        setTimeout(() => {

          this.socket.disconnectedSocket()

          this.toastr.successToastr('userLogOutSuccessfully', 'Yeah');
          this.router.navigate(['/'])



        }, 1000)

      },
      error => {
        console.log(error.message);
        this.toastr.errorToastr('Some Error Occurred while deleting Todo', 'Oops!');
      })


  }



  public edit(todoId) {


    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%"
    //dialogConfig.data=this.currentTodo

    this.appService.getPerticularTodo(todoId).subscribe(
      data => {

        this.currentTodo = data['data']
        console.log(this.currentTodo)

        this.dialog.open(EditComponent, {
          data: this.currentTodo
        }).afterClosed().subscribe(result => {
          this.getAllTodos()
        })

        this.toastr.successToastr('TodoFoundSuccessfully', 'Yeah');
      },
      error => {
        console.log(error.message);
        this.toastr.errorToastr('Some Error Occurred while editing', 'Oops!');
      })

    //this.dialog.open(EditComponent, dialogConfig)


  }

} // end signinFunction
