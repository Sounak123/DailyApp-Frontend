import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';


import { Task, DaysTask } from './model/task-model'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

const httpURL = "http://localhost:8080/daily-task";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }


  getTaskList(task:Task): Observable<DaysTask[]> {
    let operation = httpURL+"/get-task";
    return this.http.post<DaysTask[]>(operation,task,httpOptions).pipe(
      catchError(this.handleError<DaysTask[]>('getTaskList', []))
    );
  }

  addNewTask(task: Task):Observable<DaysTask[]> {
    let operation = httpURL + "/add-task";
    return this.http.post<DaysTask[]>(operation, task, httpOptions).pipe(
      catchError(this.handleError)
    );
  }


  updateExistingTask(task: Task):Observable<DaysTask[]> {
    let operation = httpURL + "/update-task";
    return this.http.post<DaysTask[]>(operation, task, httpOptions).pipe(
      catchError(this.handleError)
    );
  }



  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      //this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
