import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ng6-toastr-notifications';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { TodoService } from './todo.service';
import { MatDialogModule } from "@angular/material/dialog";
import { EditComponent } from './edit/edit.component';
import {NgxPaginationModule} from 'ngx-pagination';



@NgModule({
  declarations: [HomeComponent, EditComponent],
  imports: [
    CommonModule,
    FormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    NgxPaginationModule,
    HttpClientModule,
   MatDialogModule,
    RouterModule.forChild([
      {path:'home', component:HomeComponent}
    ])
  ],
  providers:[TodoService],
 //entryComponents:[EditComponent]
})
export class TodoModule { }
