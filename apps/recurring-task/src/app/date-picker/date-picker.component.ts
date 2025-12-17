import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CalendarDate {
  day: number;
  isCurrentMonth: boolean;
  isSelected: boolean;
  date: Date;
}

interface DatePreset {
  label: string;
  shortcut: string;
}

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss'
})
export class DatePickerComponent {
  currentMonth = 'June';
  currentYear = '2022';
  
  weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  
  presets: DatePreset[] = [
    { label: 'Today', shortcut: 'Mon' },
    { label: 'Tomorrow', shortcut: 'Tue' },
    { label: 'This weekend', shortcut: 'Sat' },
    { label: 'Next weekend', shortcut: '25 Jun' },
    { label: '2 weeks', shortcut: '27 Jun' },
    { label: '4 weeks', shortcut: '11 Jul' }
  ];

  calendarDates: CalendarDate[] = [];

  constructor() {
    this.generateCalendar();
  }

  generateCalendar() {
    // Generate June 2022 calendar matching the Figma design
    const dates: CalendarDate[] = [];
    
    // Previous month dates (May 29-31)
    for (let day = 29; day <= 31; day++) {
      dates.push({
        day,
        isCurrentMonth: false,
        isSelected: false,
        date: new Date(2022, 4, day)
      });
    }
    
    // Current month dates (June 1-30)
    for (let day = 1; day <= 30; day++) {
      dates.push({
        day,
        isCurrentMonth: true,
        isSelected: day === 2, // June 2nd is selected in the design
        date: new Date(2022, 5, day)
      });
    }
    
    // Next month dates (July 1-9)
    for (let day = 1; day <= 9; day++) {
      dates.push({
        day,
        isCurrentMonth: false,
        isSelected: false,
        date: new Date(2022, 6, day)
      });
    }
    
    this.calendarDates = dates;
  }

  selectDate(date: CalendarDate) {
    if (!date.isCurrentMonth) return;
    
    // Deselect all dates
    this.calendarDates.forEach(d => d.isSelected = false);
    // Select clicked date
    date.isSelected = true;
  }

  selectPreset(preset: DatePreset) {
    console.log('Selected preset:', preset.label);
  }

  previousMonth() {
    console.log('Previous month');
  }

  nextMonth() {
    console.log('Next month');
  }
}






