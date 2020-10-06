import { Component, OnInit, Optional } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { TodoService } from '../todo.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { SocketService } from '../socket.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  public todo;
  public receiverName: string;
  public editedData = [];

  constructor(
    public router: Router,
    public toastr: ToastrManager,
    public todoService: TodoService,
    public socketService: SocketService,
    public dialogBox: MatDialogRef<EditComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    console.log(data);
    this.todo = data;
  }

  ngOnInit() {

    this.receiverName = Cookie.get('receiverName');

  }



  public onClose() {
    this.dialogBox.close();
  }



  public onSave() {

    this.todoService.edit(this.todo).subscribe(
      data => {


        setTimeout(() => {

          this.editedData = [];

          const temp = {todo: this.todo.todo, user: this.receiverName};

          this.editedData.push(temp);



          this.socketService.editButtonClicked(this.editedData);

        }, 1000);



        console.log(data);
        this.toastr.successToastr('TodoEditedSuccessfully', 'Yeah');
        setTimeout(() => {
          this.dialogBox.close();
        }, 2000);

      },
      error => {
        console.log(error.message);
        this.toastr.errorToastr('Some Error Occurred while editing', 'Oops!');
      });
  }


}
