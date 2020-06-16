import { Component, OnInit, Input, Output, EventEmitter, Renderer2 } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { Task } from '../model/task-model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  @Input() task: Task;
  classType:string;
  @Output() populateForm = new EventEmitter<Task>();

  constructor() { }

  ngOnInit(): void {
    switch(this.task.status){
      case "New": 
        this.classType="badge badge-danger";
        break;
      case "InProgress":
        this.classType="badge badge-primary";
        break;
      case "Completed":
          this.classType="badge badge-success";
          break;
      default:
          this.classType="badge badge-secondary";
          break;
    }
  }

  parse(value: any): Date | null {
    if ((typeof value === 'string') && (value.includes('/'))) {
      const str = value.split('/');

      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);
      
      return new Date(year, month, date);
    } else if((typeof value === 'string') && value === '') {
      return new Date();
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }


  updateTaskComponent(){
   this.populateForm.emit(this.task);
  }



}
