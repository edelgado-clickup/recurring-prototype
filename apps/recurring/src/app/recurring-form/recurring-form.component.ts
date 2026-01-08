import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CalendarDate {
  day: number;
  isCurrentMonth: boolean;
  isSelected: boolean;
  date: Date;
}

interface Action {
  id: string;
  type: ActionType;
  label: string;
  showDropdown?: boolean;
}

type ActionType = 'create-task' | 'update-status' | 'reset-on-complete' | null;

interface ActionOption {
  type: ActionType;
  label: string;
  disabled: boolean;
}

@Component({
  selector: 'app-recurring-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recurring-form.component.html',
  styleUrl: './recurring-form.component.scss'
})
export class RecurringFormComponent {
  @Output() back = new EventEmitter<void>();
  
  currentMonth = 'June';
  currentYear = '2022';
  
  weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  dayButtons = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  selectedDays: boolean[] = [false, false, false, true, false, false, false];
  
  trigger = 'Task is Complete';
  frequency = '1';
  period = 'week';
  endDate = 'Never';
  
  calendarDates: CalendarDate[] = [];
  
  // Actions
  actions: Action[] = [];
  
  availableActions: ActionOption[] = [
    { type: 'create-task', label: 'Create task', disabled: false },
    { type: 'update-status', label: 'Update status to...', disabled: false },
    { type: 'reset-on-complete', label: 'Reset on complete', disabled: false }
  ];

  constructor() {
    this.generateCalendar();
  }

  generateCalendar() {
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
        isSelected: day === 2,
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

  toggleDay(index: number) {
    this.selectedDays[index] = !this.selectedDays[index];
  }

  selectDate(date: CalendarDate) {
    if (!date.isCurrentMonth) return;
    this.calendarDates.forEach(d => d.isSelected = false);
    date.isSelected = true;
  }

  previousMonth() {
    console.log('Previous month');
  }

  nextMonth() {
    console.log('Next month');
  }

  onCancel() {
    this.back.emit();
  }

  onSave() {
    console.log('Save recurring task');
    this.back.emit();
  }

  testAddAction() {
    console.log('🧪 TEST button clicked!');
    alert('Test button works! Adding action...');
    
    const newAction: Action = {
      id: Date.now().toString(),
      type: null,
      label: 'Select action...',
      showDropdown: true
    };
    
    this.actions = [...this.actions, newAction];
    console.log('🧪 Actions now:', this.actions);
  }

  // Action Methods
  getAvailableActions(): ActionOption[] {
    const selectedTypes = this.actions.map(a => a.type);
    return this.availableActions.map(action => ({
      ...action,
      disabled: selectedTypes.includes(action.type)
    }));
  }

  canAddMoreActions(): boolean {
    return this.actions.length < 3;
  }

  addAction() {
    console.log('🔥 addAction clicked!', this.actions);
    
    const newAction: Action = {
      id: Date.now().toString(),
      type: null,
      label: 'Select action...',
      showDropdown: true
    };
    
    this.actions = [...this.actions, newAction];
    console.log('🔥 After push:', this.actions);
  }

  toggleActionDropdown(action: Action, event?: Event) {
    // Close all other dropdowns
    this.actions.forEach(a => {
      if (a.id !== action.id) {
        a.showDropdown = false;
      }
    });
    
    action.showDropdown = !action.showDropdown;
  }

  selectAction(action: Action, option: ActionOption) {
    if (option.disabled) return;
    
    action.type = option.type;
    action.label = option.label;
    action.showDropdown = false;
  }

  removeAction(actionId: string) {
    this.actions = this.actions.filter(a => a.id !== actionId);
  }

  closeAllDropdowns() {
    this.actions.forEach(a => a.showDropdown = false);
  }
}









