import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { TaskService } from '../task-service.service';
import { Task, DaysTask } from '../model/task-model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  daysTasks:DaysTask[];
  modalTitle: string;
  startDate: string;
  showMsg: boolean;
  addOrUpdateTask: FormGroup;
  submitted = false;
  

  constructor(private taskService : TaskService, private fb: FormBuilder ) { }

  ngOnInit(): void {
    let date = new Date();
    this._initializeValue(date);

    this.addOrUpdateTask = this.fb.group({
      id: [''], 
      task: ['',Validators.required],
      startDate: ['',Validators.required],
      endDate: ['',Validators.required],
      taskType: ['',Validators.required],
      status: ['',Validators.required]
    });
  }

  getTaskList(task:Task):void{
    this.taskService.getTaskList(task).subscribe(daysTasks => this.daysTasks=daysTasks);
  }

  addNewTask(task: Task): void {
    this.taskService.addNewTask(task).subscribe(daysTasks => console.log(daysTasks));
  }

  updateTask(task: Task): void {
    this.taskService.updateExistingTask(task).subscribe(daysTasks => console.log(daysTasks));
  }


  // convenience getter for easy access to form fields
  get f() { return this.addOrUpdateTask.controls; }


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

  getTasks(){
    console.log("Date->"+this.startDate);
    let date = this.parse(this.startDate);
    this._initializeValue(date);
  }

  previousDay(){
    console.log("prev click");
    let date = new Date(this.parse(this.startDate));
    date.setDate(date.getDate()-1);
    this._initializeValue(date);
  }

  nextDay(){
    console.log("next click");
    let date = new Date(this.parse(this.startDate));
    date.setDate(date.getDate()+1);
    this._initializeValue(date);
  }

  onSubmit(){
    this.submitted = true;
    console.log("form submitted");

    if (this.addOrUpdateTask.invalid) {
      return;
    }
    console.log('Form Data' + JSON.stringify(this.addOrUpdateTask.value, null, 4));

    let task: Task = new Task();

    //can be written as ->task.task = this.addOrUpdateTask.controls['task'].value;
    task.task = this.f.task.value;
    task.start = this.f.startDate.value;
    task.end = this.f.endDate.value;
    task.taskType = this.f.taskType.value;
    task.status = this.f.status.value;
    task.id = parseInt(this.f.id.value);

    if(task.id){
      //Update task
      this.updateTask(task);
    }else{
      //add task
      this.addNewTask(task);
    }

    this.addOrUpdateTask.reset();
    this.showMsg=true;
    this.submitted = false;

    let date = new Date();
    this._initializeValue(date);
  }

  addValueToForm(task:Task){
    // Can be written as: -> this.addOrUpdateTask.controls['id'].setValue(task.id);
    // Here we are using get f function
    this.f.id.setValue(task.id);
    this.f.task.setValue(task.task);
    this.f.startDate.setValue(task.start.substring(0,16));
    this.f.endDate.setValue(task.end.substring(0,16));
    this.f.taskType.setValue(task.taskType);
    this.f.status.setValue(task.status);
  }

  _initializeValue(date: Date){
    this.startDate = date.toISOString().substr(0,10);
    let taskRequest:Task = new Task();
    taskRequest.start = date.toISOString();
    this.getTaskList(taskRequest);
  }

}
