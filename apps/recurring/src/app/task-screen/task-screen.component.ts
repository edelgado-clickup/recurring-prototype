import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { DatePickerComponent } from '../date-picker/date-picker.component';

@Component({
  selector: 'app-task-screen',
  standalone: true,
  imports: [CommonModule, DatePickerComponent],
  templateUrl: './task-screen.component.html',
  styleUrl: './task-screen.component.scss',
  animations: [
    trigger('dropdownAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-8px)' }),
        animate('150ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('100ms ease-in', style({ opacity: 0, transform: 'translateY(-8px)' }))
      ])
    ]),
    trigger('tooltipAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50%) translateY(4px)' }),
        animate('150ms ease-out', style({ opacity: 1, transform: 'translateX(-50%) translateY(0)' }))
      ]),
      transition(':leave', [
        animate('100ms ease-in', style({ opacity: 0, transform: 'translateX(-50%) translateY(4px)' }))
      ])
    ])
  ]
})
export class TaskScreenComponent {
  showDatePicker = false;
  
  // Task data
  taskTitle = 'Review quarterly reports';
  status = 'In Progress';
  assignee = 'Madison Lamb';
  assigneeInitials = 'ML';
  priority = 'Empty';
  timeEstimate = 'Empty';
  startDate: Date | null = null;
  dueDate: Date | null = null;
  
  // Recurring
  isRecurringSetup = false;
  recurringSummary = '';
  recurringSummaryParts: { value: string; isDynamic: boolean; field?: string; actionId?: string }[] = [];
  showRecurringTooltip = false;
  
  toggleDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }

  closeDatePicker() {
    this.showDatePicker = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInsideDatePicker = target.closest('.date-picker-dropdown') || target.closest('.due-button');
    if (!clickedInsideDatePicker && this.showDatePicker) {
      this.showDatePicker = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    this.showDatePicker = false;
  }

  onStartDateChange(date: Date | null) {
    this.startDate = date;
  }

  onDueDateChange(date: Date | null) {
    this.dueDate = date;
  }

  onRecurringStatusChange(status: {isSetup: boolean, summary: string, summaryParts: { value: string; isDynamic: boolean; field?: string; actionId?: string }[]}) {
    this.isRecurringSetup = status.isSetup;
    this.recurringSummary = status.summary;
    this.recurringSummaryParts = status.summaryParts;
  }

  formatDate(date: Date | null): string {
    if (!date) return '';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    // If it's within the next 7 days (including today), show day name
    if (diffDays >= 0 && diffDays <= 7) {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return dayNames[targetDate.getDay()];
    }
    
    // Otherwise show d/m/y format (for past dates or far future dates)
    const day = targetDate.getDate();
    const month = targetDate.getMonth() + 1;
    const year = targetDate.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  }
}
