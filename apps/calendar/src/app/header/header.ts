import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ThemeToggleComponent } from '@prototypes/theme-toggle';

@Component({
  selector: 'app-header',
  imports: [ThemeToggleComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @Input() currentPage: 'calendar' | 'task' = 'calendar';
  @Output() pageChange = new EventEmitter<'calendar' | 'task'>();

  switchPage(page: 'calendar' | 'task') {
    this.pageChange.emit(page);
  }
}
