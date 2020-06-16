export class Task {
    id: number;
    task: string;
    start: string;
    end: string;
    status: string;
    taskType: string;
  }

export class DaysTask {
  date: string;
  tasks: Task[];
}