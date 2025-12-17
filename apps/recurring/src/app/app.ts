import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { TaskScreenComponent } from './task-screen/task-screen.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TaskScreenComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class App {
  title = 'Recurring';
}

