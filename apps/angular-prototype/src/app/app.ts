import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from './header/header';
import { FormSection } from './form-section/form-section';
import { TaskDetails } from './task-details/task-details';

@Component({
  selector: 'app-root',
  imports: [CommonModule, Header, FormSection, TaskDetails],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  currentPage: 'calendar' | 'task' = 'calendar';

  onPageChange(page: 'calendar' | 'task') {
    this.currentPage = page;
  }
}
