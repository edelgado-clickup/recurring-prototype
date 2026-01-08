import { Component, HostListener, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface CalendarDate {
  day: number;
  isCurrentMonth: boolean;
  isSelected: boolean;
  date: Date;
}

interface Action {
  id: string;
  type: 'create-task' | 'update-status' | 'reset-on-complete' | null;
  label: string;
  showDropdown?: boolean;
  showStatusDropdown?: boolean;
  selectedStatus?: string;
}

interface ActionOption {
  type: 'create-task' | 'update-status' | 'reset-on-complete';
  label: string;
}

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ height: '0', opacity: 0, overflow: 'hidden' }),
        animate('200ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1, overflow: 'hidden' }),
        animate('200ms ease-in', style({ height: '0', opacity: 0 }))
      ])
    ])
  ]
})
export class DatePickerComponent {
  @Output() startDateChange = new EventEmitter<Date | null>();
  @Output() dueDateChange = new EventEmitter<Date | null>();
  @Output() recurringStatusChange = new EventEmitter<{isSetup: boolean, summary: string, summaryParts: { value: string; isDynamic: boolean; field?: string; actionId?: string }[]}>;
  
  showRecurringForm = false;
  isRecurringSetup = false; // Track if recurring has been saved/configured
  currentDate: Date;
  currentMonth: string;
  currentYear: string;
  selectedStartDate: Date | null = null;
  selectedDueDate: Date | null = null;
  activeDateField: 'start' | 'due' = 'start'; // Track which field is active for date selection
  
  weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  dayButtons = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  selectedDays: boolean[] = [false, false, false, false, false, false, false];
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                'July', 'August', 'September', 'October', 'November', 'December'];
  
  presetLabels = ['Today', 'Tomorrow', 'This weekend', 'Next weekend', '2 weeks', '4 weeks'];

  // Recurring form fields
  trigger = 'Task is complete';
  frequency = '1';
  period = 'Weeks';
  endDate = 'Never';
  repeatCount = '3'; // Number of repeats when "After number of repeats" is selected
  endOnDate: Date | null = null; // End date when "On a date" is selected
  selectedStatus = ''; // For nested status dropdown
  hasTime = false; // Track if time field is added
  selectedTime = '8:00 AM'; // Default time value
  
  // Actions
  actions: Action[] = [];
  availableActionOptions: ActionOption[] = [
    { type: 'create-task', label: 'Create task' },
    { type: 'update-status', label: 'Update status to...' },
    { type: 'reset-on-complete', label: 'Reset on complete' }
  ];
  
  // Monthly/Quarterly specific fields
  monthlyType: 'week' | 'date' = 'week';
  selectedWeek = 'First';
  selectedMonth = 'January';
  selectedDayOfMonth = '1';

  // Dropdown state
  showTriggerDropdown = false;
  showPeriodDropdown = false;
  showEndDropdown = false;
  showWeekDropdown = false;
  showMonthDropdown = false;
  showDayOfMonthDropdown = false;
  showStatusDropdown = false;
  showSettingsDropdown = false;
  
  // Settings
  skipWeekends = true; // Skip working days toggle - on by default
  hoveredTriggerOption = '';
  triggerOptions = [
    'Task is complete',
    'Task status is...',
    'On a schedule'
  ];
  statusOptions = [
    { name: 'Backlog', color: '#8d8d8d' },
    { name: 'In Progress', color: '#0091ff' },
    { name: 'Review', color: '#f76808' },
    { name: 'Done', color: '#30a46c' }
  ];
  periodOptions = [
    'Days',
    'Weeks',
    'Months',
    'Quarters',
    'Years',
    'Days after'
  ];
  endOptions = [
    'Never',
    'After number of repeats',
    'On a date'
  ];
  weekOptions = [
    'First',
    'Second',
    'Third',
    'Fourth',
    'Last'
  ];
  monthOptions = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  dayOfMonthOptions = Array.from({length: 31}, (_, i) => (i + 1).toString());

  calendarDates: CalendarDate[] = [];

  private readonly STORAGE_KEY = 'recurringFormSettings';

  constructor(private cdr: ChangeDetectorRef) {
    // Initialize to June 2022 (matching the design)
    this.currentDate = new Date(2022, 5, 1); // June 2022
    this.currentMonth = this.monthNames[this.currentDate.getMonth()];
    this.currentYear = this.currentDate.getFullYear().toString();
    this.generateCalendar();
    this.loadSettingsFromStorage();
  }

  private saveSettingsToStorage() {
    const settings = {
      isRecurringSetup: this.isRecurringSetup,
      trigger: this.trigger,
      frequency: this.frequency,
      period: this.period,
      selectedDays: this.selectedDays,
      monthlyType: this.monthlyType,
      selectedWeek: this.selectedWeek,
      selectedMonth: this.selectedMonth,
      selectedDayOfMonth: this.selectedDayOfMonth,
      endDate: this.endDate,
      repeatCount: this.repeatCount,
      hasTime: this.hasTime,
      selectedTime: this.selectedTime,
      skipWeekends: this.skipWeekends,
      selectedStatus: this.selectedStatus
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
  }

  private loadSettingsFromStorage() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const settings = JSON.parse(stored);
        this.isRecurringSetup = settings.isRecurringSetup ?? this.isRecurringSetup;
        this.trigger = settings.trigger ?? this.trigger;
        this.frequency = settings.frequency ?? this.frequency;
        this.period = settings.period ?? this.period;
        this.selectedDays = settings.selectedDays ?? this.selectedDays;
        this.monthlyType = settings.monthlyType ?? this.monthlyType;
        this.selectedWeek = settings.selectedWeek ?? this.selectedWeek;
        this.selectedMonth = settings.selectedMonth ?? this.selectedMonth;
        this.selectedDayOfMonth = settings.selectedDayOfMonth ?? this.selectedDayOfMonth;
        this.endDate = settings.endDate ?? this.endDate;
        this.repeatCount = settings.repeatCount ?? this.repeatCount;
        this.hasTime = settings.hasTime ?? this.hasTime;
        this.selectedTime = settings.selectedTime ?? this.selectedTime;
        this.skipWeekends = settings.skipWeekends ?? this.skipWeekends;
        this.selectedStatus = settings.selectedStatus ?? this.selectedStatus;
      } catch (e) {
        console.warn('Failed to load recurring settings from storage', e);
      }
    }
  }

  generateCalendar() {
    const dates: CalendarDate[] = [];
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    // Get first day of month and how many days in month
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();
    
    // Previous month dates to fill the first week
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate();
    
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      dates.push({
        day,
        isCurrentMonth: false,
        isSelected: false,
        date: new Date(prevMonthYear, prevMonth, day)
      });
    }
    
    // Current month dates
    for (let day = 1; day <= daysInMonth; day++) {
      dates.push({
        day,
        isCurrentMonth: true,
        isSelected: day === 2 && month === 5 && year === 2022, // Keep June 2nd selected initially
        date: new Date(year, month, day)
      });
    }
    
    // Next month dates to fill remaining cells (up to 42 cells total - 6 weeks)
    const remainingCells = 42 - dates.length;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;
    
    for (let day = 1; day <= remainingCells; day++) {
      dates.push({
        day,
        isCurrentMonth: false,
        isSelected: false,
        date: new Date(nextMonthYear, nextMonth, day)
      });
    }
    
    this.calendarDates = dates;
  }

  selectDate(date: CalendarDate) {
    if (!date.isCurrentMonth) return;
    
    // Set date based on which field is active
    if (this.activeDateField === 'start') {
      this.calendarDates.forEach(d => d.isSelected = false);
      date.isSelected = true;
      this.selectedStartDate = date.date;
      this.startDateChange.emit(this.selectedStartDate);
      
      // Recalculate due date if in recurring form
      this.updateDueDate();
    } else {
      // Setting due date
      this.selectedDueDate = date.date;
      this.dueDateChange.emit(this.selectedDueDate);
    }
  }

  getWeekOfMonth(date: Date): number {
    const dayOfMonth = date.getDate();
    return Math.ceil(dayOfMonth / 7);
  }

  isLastWeekOfMonth(date: Date): boolean {
    const year = date.getFullYear();
    const month = date.getMonth();
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    const dayOfMonth = date.getDate();
    const daysUntilEndOfMonth = lastDayOfMonth - dayOfMonth;
    return daysUntilEndOfMonth < 7;
  }

  isDateHighlighted(date: CalendarDate): boolean {
    if (!this.showRecurringForm) return false;

    const frequency = parseInt(this.frequency) || 1;
    const dayOfWeek = date.date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Skip weekends if enabled (Sunday = 0, Saturday = 6)
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    if (this.skipWeekends && isWeekend && this.period === 'Days') {
      return false;
    }

    // For Days period - check every N days from the selected date (skipping weekends if enabled)
    if (this.period === 'Days') {
      const selectedDate = this.calendarDates.find(d => d.isSelected);
      if (!selectedDate) return !isWeekend || !this.skipWeekends;
      
      if (this.skipWeekends) {
        // Count only working days between dates
        let workingDays = 0;
        const startDate = new Date(Math.min(selectedDate.date.getTime(), date.date.getTime()));
        const endDate = new Date(Math.max(selectedDate.date.getTime(), date.date.getTime()));
        
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const dow = d.getDay();
          if (dow !== 0 && dow !== 6) {
            workingDays++;
          }
        }
        
        // Adjust for inclusive counting
        workingDays = workingDays - 1;
        return workingDays >= 0 && workingDays % frequency === 0;
      } else {
        const daysDiff = Math.floor((date.date.getTime() - selectedDate.date.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff % frequency === 0;
      }
    }

    // For Weeks period - check if the day of week is selected
    if (this.period === 'Weeks') {
      if (!this.selectedDays[dayOfWeek]) return false;
      
      // If frequency > 1, check if it's the correct week interval
      if (frequency > 1) {
        const selectedDate = this.calendarDates.find(d => d.isSelected);
        if (!selectedDate) return this.selectedDays[dayOfWeek];
        
        const weeksDiff = Math.floor((date.date.getTime() - selectedDate.date.getTime()) / (1000 * 60 * 60 * 24 * 7));
        return weeksDiff % frequency === 0 && this.selectedDays[dayOfWeek];
      }
      
      return true;
    }

    // For Months/Quarters with 'week' type - check specific week and day of week
    if ((this.period === 'Months' || this.period === 'Quarters') && this.monthlyType === 'week') {
      // Check if the day of week matches any selected day
      if (!this.selectedDays[dayOfWeek]) {
        return false;
      }

      // Check if it's the correct week of the month
      const weekOfMonth = this.getWeekOfMonth(date.date);
      const isLastWeek = this.isLastWeekOfMonth(date.date);

      const weekMap: { [key: string]: number } = {
        'First': 1,
        'Second': 2,
        'Third': 3,
        'Fourth': 4
      };

      let matchesWeek = false;
      if (this.selectedWeek === 'Last') {
        matchesWeek = isLastWeek;
      } else {
        matchesWeek = weekOfMonth === weekMap[this.selectedWeek];
      }

      if (!matchesWeek) return false;

      // If frequency > 1, check month intervals
      if (frequency > 1) {
        const selectedDate = this.calendarDates.find(d => d.isSelected);
        if (!selectedDate) return true;
        
        const monthsDiff = (date.date.getFullYear() - selectedDate.date.getFullYear()) * 12 + 
                          (date.date.getMonth() - selectedDate.date.getMonth());
        return monthsDiff % frequency === 0;
      }

      return true;
    }

    // For Months/Quarters with 'date' type - check day of month
    if ((this.period === 'Months' || this.period === 'Quarters') && this.monthlyType === 'date') {
      const dayOfMonth = date.date.getDate();
      const matchesDay = dayOfMonth.toString() === this.selectedDayOfMonth;
      
      if (!matchesDay) return false;

      // If frequency > 1, check month intervals
      if (frequency > 1) {
        const selectedDate = this.calendarDates.find(d => d.isSelected);
        if (!selectedDate) return true;
        
        const monthsDiff = (date.date.getFullYear() - selectedDate.date.getFullYear()) * 12 + 
                          (date.date.getMonth() - selectedDate.date.getMonth());
        return monthsDiff % frequency === 0;
      }

      return true;
    }

    // For Years - check month and day
    if (this.period === 'Years') {
      const month = date.date.getMonth();
      const dayOfMonth = date.date.getDate();
      const selectedMonthIndex = this.monthNames.indexOf(this.selectedMonth);
      const matchesDate = month === selectedMonthIndex && dayOfMonth.toString() === this.selectedDayOfMonth;
      
      if (!matchesDate) return false;

      // If frequency > 1, check year intervals
      if (frequency > 1) {
        const selectedDate = this.calendarDates.find(d => d.isSelected);
        if (!selectedDate) return true;
        
        const yearsDiff = date.date.getFullYear() - selectedDate.date.getFullYear();
        return yearsDiff % frequency === 0;
      }

      return true;
    }

    return false;
  }

  selectPreset(label: string) {
    const date = this.getPresetDate(label);
    
    // Set date based on active field
    if (this.activeDateField === 'start') {
      this.selectedStartDate = date;
      this.startDateChange.emit(this.selectedStartDate);
      // Update calendar selection
      this.calendarDates.forEach(d => {
        d.isSelected = d.date.toDateString() === date.toDateString();
      });
      this.updateDueDate();
    } else {
      this.selectedDueDate = date;
      this.dueDateChange.emit(this.selectedDueDate);
    }
  }

  onSetRecurring() {
    this.showRecurringForm = true;
    // Switch to due date field since recurring will set the due date
    this.activeDateField = 'due';
    // Auto-calculate the due date based on the first recurring date
    this.selectedDueDate = this.calculateFirstRecurringDate();
    this.dueDateChange.emit(this.selectedDueDate);
  }

  toggleDay(index: number) {
    this.selectedDays[index] = !this.selectedDays[index];
    this.updateDueDate();
    this.saveSettingsToStorage();
  }

  onCancel() {
    this.showRecurringForm = false;
  }

  onSave() {
    this.isRecurringSetup = true;
    this.showRecurringForm = false;
    this.emitRecurringStatus();
    this.saveSettingsToStorage();
  }

  emitRecurringStatus() {
    const summary = this.generateRecurringSummary();
    const summaryText = summary ? summary.text : '';
    const summaryParts = summary ? summary.parts : [];
    this.recurringStatusChange.emit({
      isSetup: this.isRecurringSetup,
      summary: summaryText,
      summaryParts: summaryParts
    });
  }

  clearRecurring() {
    this.isRecurringSetup = false;
    this.showRecurringForm = false;
    // Reset to defaults
    this.trigger = 'Task is complete';
    this.frequency = '1';
    this.period = 'Weeks';
    this.endDate = 'Never';
    this.repeatCount = '3';
    this.endOnDate = null;
    this.selectedStatus = '';
    this.hasTime = false;
    this.selectedTime = '8:00 AM';
    this.actions = [];
    this.selectedDays = [false, false, false, false, false, false, false];
    this.emitRecurringStatus();
    this.saveSettingsToStorage();
  }

  editRecurring() {
    this.showRecurringForm = true;
  }

  closeAllDropdowns() {
    this.showTriggerDropdown = false;
    this.showPeriodDropdown = false;
    this.showEndDropdown = false;
    this.showWeekDropdown = false;
    this.showMonthDropdown = false;
    this.showDayOfMonthDropdown = false;
    this.showStatusDropdown = false;
    this.showSettingsDropdown = false;
    this.actions.forEach(a => {
      a.showDropdown = false;
      a.showStatusDropdown = false;
    });
  }

  toggleSettingsDropdown() {
    const wasOpen = this.showSettingsDropdown;
    this.closeAllDropdowns();
    this.showSettingsDropdown = !wasOpen;
  }

  toggleSkipWeekends() {
    this.skipWeekends = !this.skipWeekends;
    this.updateDueDate();
    this.saveSettingsToStorage();
  }

  toggleTriggerDropdown() {
    const wasOpen = this.showTriggerDropdown;
    this.closeAllDropdowns();
    this.showTriggerDropdown = !wasOpen;
  }

  selectTriggerOption(option: string) {
    if (option === 'Task status is...') {
      // Don't close dropdown yet, show status dropdown instead
      return;
    }
    this.trigger = option;
    this.selectedStatus = '';
    this.showTriggerDropdown = false;
    this.showStatusDropdown = false;
    this.saveSettingsToStorage();
  }

  onTriggerOptionHover(option: string) {
    this.hoveredTriggerOption = option;
    if (option === 'Task status is...') {
      this.showStatusDropdown = true;
    } else {
      this.showStatusDropdown = false;
    }
  }

  selectStatusOption(status: string) {
    this.trigger = 'Task status is ' + status;
    this.selectedStatus = status;
    this.showTriggerDropdown = false;
    this.showStatusDropdown = false;
    this.saveSettingsToStorage();
  }

  togglePeriodDropdown() {
    const wasOpen = this.showPeriodDropdown;
    this.closeAllDropdowns();
    this.showPeriodDropdown = !wasOpen;
  }

  selectPeriodOption(option: string) {
    this.period = option;
    this.showPeriodDropdown = false;
    this.updateDueDate();
    this.saveSettingsToStorage();
  }

  getPeriodDisplayLabel(period: string): string {
    const freq = parseInt(this.frequency) || 1;
    
    if (freq === 1) {
      // Singular form
      switch (period) {
        case 'Days': return 'Day';
        case 'Weeks': return 'Week';
        case 'Months': return 'Month';
        case 'Quarters': return 'Quarter';
        case 'Years': return 'Year';
        case 'Days after': return 'Day after';
        default: return period;
      }
    } else {
      // Plural form
      switch (period) {
        case 'Days': return 'Days';
        case 'Weeks': return 'Weeks';
        case 'Months': return 'Months';
        case 'Quarters': return 'Quarters';
        case 'Years': return 'Years';
        case 'Days after': return 'Days after';
        default: return period;
      }
    }
  }

  toggleEndDropdown() {
    const wasOpen = this.showEndDropdown;
    this.closeAllDropdowns();
    this.showEndDropdown = !wasOpen;
  }

  selectEndOption(option: string) {
    this.endDate = option;
    this.showEndDropdown = false;
    
    // Set default end date if "On a date" is selected
    if (option === 'On a date' && !this.endOnDate) {
      // Default to 1 month from now
      this.endOnDate = new Date();
      this.endOnDate.setMonth(this.endOnDate.getMonth() + 1);
    }
    this.saveSettingsToStorage();
  }

  onRepeatCountChange() {
    // Ensure repeat count is at least 1
    const count = parseInt(this.repeatCount) || 1;
    if (count < 1) {
      this.repeatCount = '1';
    }
    this.saveSettingsToStorage();
  }

  toggleEndDatePicker() {
    // For now, cycle through some preset dates
    // In a real implementation, this would open a date picker
    if (!this.endOnDate) {
      this.endOnDate = new Date();
      this.endOnDate.setMonth(this.endOnDate.getMonth() + 1);
    } else {
      // Add 1 week each click for demo purposes
      this.endOnDate.setDate(this.endOnDate.getDate() + 7);
      this.endOnDate = new Date(this.endOnDate); // Trigger change detection
    }
  }

  formatEndOnDate(): string {
    if (!this.endOnDate) return 'Select date';
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return this.endOnDate.toLocaleDateString('en-US', options);
  }

  toggleWeekDropdown() {
    const wasOpen = this.showWeekDropdown;
    this.closeAllDropdowns();
    this.showWeekDropdown = !wasOpen;
  }

  selectWeekOption(option: string) {
    this.selectedWeek = option;
    this.showWeekDropdown = false;
    this.updateDueDate();
    this.saveSettingsToStorage();
  }

  toggleMonthDropdown() {
    const wasOpen = this.showMonthDropdown;
    this.closeAllDropdowns();
    this.showMonthDropdown = !wasOpen;
  }

  selectMonthOption(option: string) {
    this.selectedMonth = option;
    this.showMonthDropdown = false;
    this.updateDueDate();
    this.saveSettingsToStorage();
  }

  toggleDayOfMonthDropdown() {
    const wasOpen = this.showDayOfMonthDropdown;
    this.closeAllDropdowns();
    this.showDayOfMonthDropdown = !wasOpen;
  }

  selectDayOfMonthOption(option: string) {
    this.selectedDayOfMonth = option;
    this.showDayOfMonthDropdown = false;
    this.updateDueDate();
    this.saveSettingsToStorage();
  }

  addTime() {
    this.hasTime = true;
    this.saveSettingsToStorage();
  }

  removeTime() {
    this.hasTime = false;
    this.saveSettingsToStorage();
  }

  // Action Methods
  canAddMoreActions(): boolean {
    return this.actions.length < 3;
  }

  isActionDisabled(type: 'create-task' | 'update-status' | 'reset-on-complete'): boolean {
    return this.actions.some(a => a.type === type);
  }

  addAction() {
    if (!this.canAddMoreActions()) return;
    
    const newAction: Action = {
      id: Date.now().toString(),
      type: null,
      label: 'Select action...',
      showDropdown: false
    };
    
    this.actions = [...this.actions, newAction];
  }

  toggleActionDropdown(action: Action) {
    const wasOpen = action.showDropdown;
    this.closeAllDropdowns();
    action.showDropdown = !wasOpen;
  }

  selectActionOption(action: Action, option: ActionOption) {
    if (this.isActionDisabled(option.type)) return;
    
    // If selecting "Update status to...", show the status subdropdown
    if (option.type === 'update-status') {
      action.showStatusDropdown = true;
      return;
    }
    
    action.type = option.type;
    action.label = option.label;
    action.showDropdown = false;
    action.showStatusDropdown = false;
  }

  onActionOptionHover(action: Action, option: ActionOption) {
    if (option.type === 'update-status' && !this.isActionDisabled(option.type)) {
      action.showStatusDropdown = true;
    } else {
      action.showStatusDropdown = false;
    }
  }

  selectActionStatus(action: Action, status: { name: string; color: string }) {
    action.type = 'update-status';
    action.label = 'Update status to ' + status.name;
    action.selectedStatus = status.name;
    action.showDropdown = false;
    action.showStatusDropdown = false;
  }

  removeAction(actionId: string) {
    this.actions = this.actions.filter(a => a.id !== actionId);
  }

  closeAllActionDropdowns() {
    this.actions.forEach(a => a.showDropdown = false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.form-input-full') || target.closest('.radio-buttons');
    if (!clickedInside) {
      this.showTriggerDropdown = false;
      this.showPeriodDropdown = false;
      this.showEndDropdown = false;
      this.showWeekDropdown = false;
      this.showMonthDropdown = false;
      this.showDayOfMonthDropdown = false;
      this.showStatusDropdown = false;
    }
  }

  formatStartDate(): string {
    if (!this.selectedStartDate) return 'Start date';
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return this.selectedStartDate.toLocaleDateString('en-US', options);
  }

  formatDueDate(): string {
    if (!this.selectedDueDate) return 'Due date';
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return this.selectedDueDate.toLocaleDateString('en-US', options);
  }

  getPresetDate(label: string): Date {
    const baseDate = this.selectedStartDate ? new Date(this.selectedStartDate) : new Date();
    const result = new Date(baseDate);
    
    switch (label) {
      case 'Today':
        break;
      case 'Tomorrow':
        result.setDate(result.getDate() + 1);
        break;
      case 'This weekend':
        const daysUntilSaturday = (6 - baseDate.getDay() + 7) % 7;
        result.setDate(result.getDate() + (daysUntilSaturday === 0 ? 7 : daysUntilSaturday));
        break;
      case 'Next weekend':
        const daysToNextSat = (6 - baseDate.getDay() + 7) % 7;
        result.setDate(result.getDate() + daysToNextSat + 7);
        break;
      case '2 weeks':
        result.setDate(result.getDate() + 14);
        break;
      case '4 weeks':
        result.setDate(result.getDate() + 28);
        break;
    }
    
    return result;
  }

  getPresetShortcut(label: string): string {
    const date = this.getPresetDate(label);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // For Today/Tomorrow, show day name
    if (label === 'Today' || label === 'Tomorrow' || label === 'This weekend') {
      return dayNames[date.getDay()];
    }
    
    // For others, show date
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', options);
  }

  setActiveField(field: 'start' | 'due') {
    this.activeDateField = field;
  }

  clearStartDate() {
    this.selectedStartDate = null;
    this.startDateChange.emit(null);
    // Also clear the calendar selection
    this.calendarDates.forEach(d => d.isSelected = false);
  }

  clearDueDate() {
    this.selectedDueDate = null;
    this.dueDateChange.emit(null);
  }

  calculateFirstRecurringDate(): Date | null {
    if (!this.selectedStartDate) return null;
    
    const startDate = new Date(this.selectedStartDate);
    const frequency = parseInt(this.frequency) || 1;
    
    // Calculate first recurring date based on period
    if (this.period === 'Days') {
      const nextDate = new Date(startDate);
      let daysAdded = 0;
      
      while (daysAdded < frequency) {
        nextDate.setDate(nextDate.getDate() + 1);
        const dayOfWeek = nextDate.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        // Skip weekends if enabled
        if (!this.skipWeekends || !isWeekend) {
          daysAdded++;
        }
      }
      return nextDate;
    }
    
    if (this.period === 'Weeks') {
      // Find the first selected day of week after the start date
      const nextDate = new Date(startDate);
      
      // Check if any days are selected
      const hasSelectedDays = this.selectedDays.some(d => d);
      
      if (hasSelectedDays) {
        // Find the next occurrence of a selected day
        let found = false;
        let daysChecked = 0;
        
        // Start from the day after start date
        nextDate.setDate(nextDate.getDate() + 1);
        
        while (!found && daysChecked < 7) {
          const dayOfWeek = nextDate.getDay();
          if (this.selectedDays[dayOfWeek]) {
            found = true;
          } else {
            nextDate.setDate(nextDate.getDate() + 1);
            daysChecked++;
          }
        }
        
        // If frequency > 1, add additional weeks
        if (frequency > 1) {
          nextDate.setDate(nextDate.getDate() + ((frequency - 1) * 7));
        }
        
        return nextDate;
      } else {
        // No days selected, just add weeks
        nextDate.setDate(nextDate.getDate() + (frequency * 7));
        return nextDate;
      }
    }
    
    if (this.period === 'Months' || this.period === 'Quarters') {
      const nextDate = new Date(startDate);
      const monthsToAdd = this.period === 'Quarters' ? frequency * 3 : frequency;
      nextDate.setMonth(nextDate.getMonth() + monthsToAdd);
      return nextDate;
    }
    
    if (this.period === 'Years') {
      const nextDate = new Date(startDate);
      nextDate.setFullYear(nextDate.getFullYear() + frequency);
      return nextDate;
    }
    
    return null;
  }

  updateDueDate() {
    if (this.showRecurringForm) {
      this.selectedDueDate = this.calculateFirstRecurringDate();
      this.dueDateChange.emit(this.selectedDueDate);
    }
  }

  onFrequencyChange() {
    this.updateDueDate();
    this.saveSettingsToStorage();
  }

  // Generate the recurring summary sentence
  generateRecurringSummary(): { text: string; parts: { value: string; isDynamic: boolean; field?: string; actionId?: string }[] } | null {
    // Show summary if recurring form is open OR if recurring is already set up
    if (!this.showRecurringForm && !this.isRecurringSetup) return null;
    
    const parts: { value: string; isDynamic: boolean; field?: string; actionId?: string }[] = [];
    
    // TRIGGER part
    parts.push({ value: 'Recur when ', isDynamic: false });
    
    if (this.trigger === 'Task is complete') {
      parts.push({ value: 'task is complete', isDynamic: true, field: 'trigger' });
    } else if (this.trigger.startsWith('Task status is')) {
      parts.push({ value: `task status is "${this.selectedStatus}"`, isDynamic: true, field: 'trigger' });
    } else if (this.trigger === 'On a schedule') {
      parts.push({ value: 'on a schedule', isDynamic: true, field: 'trigger' });
    }
    
    // Collect all actions as arrays of parts (including the implicit "set due date" action)
    const allActionParts: { value: string; isDynamic: boolean; field?: string; actionId?: string }[][] = [];
    
    // DATE_RULE parts (always present - this is the core recurring rule)
    const dateRuleParts = this.generateDateRuleParts();
    const dueDateParts: { value: string; isDynamic: boolean; field?: string; actionId?: string }[] = [
      { value: 'set due date ', isDynamic: false },
      ...dateRuleParts
    ];
    allActionParts.push(dueDateParts);
    
    // Additional ACTION parts (if any actions are set)
    for (const action of this.actions) {
      if (action.type) {
        if (action.type === 'create-task') {
          allActionParts.push([{ value: 'create task', isDynamic: true, field: 'action', actionId: action.id }]);
        } else if (action.type === 'update-status') {
          allActionParts.push([{ value: `update status to "${action.selectedStatus}"`, isDynamic: true, field: 'action', actionId: action.id }]);
        } else if (action.type === 'reset-on-complete') {
          allActionParts.push([{ value: 'reset on complete', isDynamic: true, field: 'action', actionId: action.id }]);
        }
      }
    }
    
    // Add actions with proper conjunctions
    allActionParts.forEach((actionParts, index) => {
      if (index === 0) {
        parts.push({ value: ', ', isDynamic: false });
      } else if (index === allActionParts.length - 1 && allActionParts.length > 1) {
        parts.push({ value: ', and ', isDynamic: false });
      } else {
        parts.push({ value: ', ', isDynamic: false });
      }
      parts.push(...actionParts);
    });
    
    // TIME part (if time is set)
    if (this.hasTime) {
      parts.push({ value: ' at ', isDynamic: false });
      parts.push({ value: this.selectedTime, isDynamic: true, field: 'time' });
    }
    
    parts.push({ value: '.', isDynamic: false });
    
    // REPEAT_RULE part (if not "Never")
    if (this.endDate !== 'Never') {
      parts.push({ value: ' Repeat ', isDynamic: false });
      if (this.endDate === 'After number of repeats') {
        const count = parseInt(this.repeatCount) || 1;
        parts.push({ value: `${count} ${count === 1 ? 'time' : 'times'}`, isDynamic: true, field: 'repeatCount' });
      } else if (this.endDate === 'On a date' && this.endOnDate) {
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
        const dateStr = this.endOnDate.toLocaleDateString('en-US', options);
        parts.push({ value: `until ${dateStr}`, isDynamic: true, field: 'endOnDate' });
      }
      parts.push({ value: '.', isDynamic: false });
    }
    
    const text = parts.map(p => p.value).join('');
    return { text, parts };
  }

  // Generate date rule as individual clickable parts
  generateDateRuleParts(): { value: string; isDynamic: boolean; field?: string }[] {
    const parts: { value: string; isDynamic: boolean; field?: string }[] = [];
    const frequency = parseInt(this.frequency) || 1;
    
    // Handle "Days" period
    if (this.period === 'Days') {
      parts.push({ value: 'every ', isDynamic: false });
      if (frequency > 1) {
        parts.push({ value: `${frequency}`, isDynamic: true, field: 'frequency' });
        parts.push({ value: ' ', isDynamic: false });
      }
      const dayWord = this.skipWeekends 
        ? (frequency === 1 ? 'work day' : 'work days')
        : (frequency === 1 ? 'day' : 'days');
      parts.push({ value: dayWord, isDynamic: true, field: 'period' });
      return parts;
    }
    
    // Handle "Weeks" period
    if (this.period === 'Weeks') {
      const selectedDayNames = this.getSelectedDayNames();
      parts.push({ value: 'every ', isDynamic: false });
      
      if (frequency > 1) {
        parts.push({ value: `${frequency}`, isDynamic: true, field: 'frequency' });
        parts.push({ value: ' ', isDynamic: false });
        parts.push({ value: 'weeks', isDynamic: true, field: 'period' });
        if (selectedDayNames.length > 0) {
          parts.push({ value: ' on ', isDynamic: false });
          parts.push({ value: selectedDayNames.join(', '), isDynamic: true, field: 'days' });
        }
      } else {
        if (selectedDayNames.length > 0) {
          parts.push({ value: selectedDayNames.join(', '), isDynamic: true, field: 'days' });
        } else {
          parts.push({ value: 'week', isDynamic: true, field: 'period' });
        }
      }
      return parts;
    }
    
    // Handle "Months" period
    if (this.period === 'Months') {
      if (this.monthlyType === 'week') {
        const selectedDayNames = this.getSelectedDayNames();
        const dayStr = selectedDayNames.length > 0 ? selectedDayNames[0] : 'day';
        parts.push({ value: this.selectedWeek.toLowerCase(), isDynamic: true, field: 'week' });
        parts.push({ value: ' ', isDynamic: false });
        parts.push({ value: dayStr, isDynamic: true, field: 'days' });
        parts.push({ value: ' of ', isDynamic: false });
        if (frequency === 1) {
          parts.push({ value: 'the month', isDynamic: true, field: 'period' });
        } else {
          parts.push({ value: 'every ', isDynamic: false });
          parts.push({ value: `${frequency}`, isDynamic: true, field: 'frequency' });
          parts.push({ value: ' ', isDynamic: false });
          parts.push({ value: 'months', isDynamic: true, field: 'period' });
        }
      } else {
        parts.push({ value: 'day ', isDynamic: false });
        parts.push({ value: this.selectedDayOfMonth, isDynamic: true, field: 'dayOfMonth' });
        parts.push({ value: ' of ', isDynamic: false });
        if (frequency === 1) {
          parts.push({ value: 'the month', isDynamic: true, field: 'period' });
        } else {
          parts.push({ value: 'every ', isDynamic: false });
          parts.push({ value: `${frequency}`, isDynamic: true, field: 'frequency' });
          parts.push({ value: ' ', isDynamic: false });
          parts.push({ value: 'months', isDynamic: true, field: 'period' });
        }
      }
      return parts;
    }
    
    // Handle "Quarters" period
    if (this.period === 'Quarters') {
      parts.push({ value: 'every ', isDynamic: false });
      if (frequency > 1) {
        parts.push({ value: `${frequency}`, isDynamic: true, field: 'frequency' });
        parts.push({ value: ' ', isDynamic: false });
      }
      parts.push({ value: frequency === 1 ? 'quarter' : 'quarters', isDynamic: true, field: 'period' });
      return parts;
    }
    
    // Handle "Years" period
    if (this.period === 'Years') {
      parts.push({ value: this.selectedMonth, isDynamic: true, field: 'month' });
      parts.push({ value: ' ', isDynamic: false });
      parts.push({ value: this.selectedDayOfMonth, isDynamic: true, field: 'dayOfMonth' });
      parts.push({ value: ' every ', isDynamic: false });
      if (frequency > 1) {
        parts.push({ value: `${frequency}`, isDynamic: true, field: 'frequency' });
        parts.push({ value: ' ', isDynamic: false });
      }
      parts.push({ value: frequency === 1 ? 'year' : 'years', isDynamic: true, field: 'period' });
      return parts;
    }
    
    // Handle "Days after" period
    if (this.period === 'Days after') {
      if (frequency > 1) {
        parts.push({ value: `${frequency}`, isDynamic: true, field: 'frequency' });
        parts.push({ value: ' ', isDynamic: false });
      } else {
        parts.push({ value: '1', isDynamic: true, field: 'frequency' });
        parts.push({ value: ' ', isDynamic: false });
      }
      parts.push({ value: frequency === 1 ? 'day' : 'days', isDynamic: true, field: 'period' });
      parts.push({ value: ' after completion', isDynamic: false });
      return parts;
    }
    
    // Default fallback
    parts.push({ value: 'every ', isDynamic: false });
    parts.push({ value: `${frequency}`, isDynamic: true, field: 'frequency' });
    parts.push({ value: ' ', isDynamic: false });
    parts.push({ value: this.period.toLowerCase(), isDynamic: true, field: 'period' });
    return parts;
  }

  // Handle click on dynamic summary parts
  onSummaryPartClick(part: { value: string; isDynamic: boolean; field?: string; actionId?: string }, event: MouseEvent) {
    event.stopPropagation();
    
    if (!part.isDynamic || !part.field) return;
    
    // Close all dropdowns first
    this.closeAllDropdowns();
    
    // Check if form needs to be opened first
    const needsFormOpen = !this.showRecurringForm;
    
    if (needsFormOpen) {
      this.showRecurringForm = true;
      // Trigger change detection to render the form
      this.cdr.detectChanges();
    }
    
    // Use setTimeout to allow the form to fully render before opening dropdowns
    setTimeout(() => {
      switch (part.field) {
        case 'trigger':
          this.showTriggerDropdown = true;
          break;
        case 'period':
          this.showPeriodDropdown = true;
          break;
        case 'frequency':
          // Focus the frequency input
          this.cdr.detectChanges();
          setTimeout(() => {
            const input = document.querySelector('.frequency-input .number-input') as HTMLInputElement;
            if (input) {
              input.focus();
              input.select();
            }
          }, 50);
          break;
        case 'days':
          // Highlight the day buttons - they're already visible, just scroll to them
          // The user can click on them directly
          this.cdr.detectChanges();
          setTimeout(() => {
            const dayButtons = document.querySelector('.day-buttons') as HTMLElement;
            if (dayButtons) {
              dayButtons.scrollIntoView({ behavior: 'smooth', block: 'center' });
              // Add a brief highlight effect
              dayButtons.style.boxShadow = '0 0 0 2px rgba(102, 71, 240, 0.4)';
              setTimeout(() => {
                dayButtons.style.boxShadow = '';
              }, 1000);
            }
          }, 50);
          break;
        case 'week':
          this.showWeekDropdown = true;
          break;
        case 'dayOfMonth':
          this.showDayOfMonthDropdown = true;
          break;
        case 'month':
          this.showMonthDropdown = true;
          break;
        case 'action':
          // Find the action by ID and open its dropdown
          if (part.actionId) {
            const action = this.actions.find(a => a.id === part.actionId);
            if (action) {
              action.showDropdown = true;
            }
          }
          break;
        case 'time':
          // Time field doesn't have a dropdown currently, but we could add one
          // For now, just ensure the form is visible
          break;
        case 'repeatCount':
          // Focus the repeat count input
          this.endDate = 'After number of repeats';
          this.cdr.detectChanges();
          // Try to focus the input after a brief delay
          setTimeout(() => {
            const inputs = document.querySelectorAll('.form-section .number-input') as NodeListOf<HTMLInputElement>;
            // The repeat count input is the second number input (after frequency)
            if (inputs.length > 1) {
              inputs[inputs.length - 1].focus();
              inputs[inputs.length - 1].select();
            }
          }, 50);
          break;
        case 'endOnDate':
          this.toggleEndDatePicker();
          break;
      }
      // Trigger change detection after opening dropdown
      this.cdr.detectChanges();
    }, needsFormOpen ? 100 : 0);
  }

  generateDateRule(): string {
    const frequency = parseInt(this.frequency) || 1;
    const period = this.period.toLowerCase();
    
    // Handle "Days" period
    if (this.period === 'Days') {
      if (frequency === 1) {
        return this.skipWeekends ? 'every work day' : 'every day';
      }
      return this.skipWeekends 
        ? `every ${frequency} work days` 
        : `every ${frequency} days`;
    }
    
    // Handle "Weeks" period
    if (this.period === 'Weeks') {
      const selectedDayNames = this.getSelectedDayNames();
      if (selectedDayNames.length > 0) {
        const daysStr = selectedDayNames.join(', ');
        if (frequency === 1) {
          return `every ${daysStr}`;
        }
        return `every ${frequency} weeks on ${daysStr}`;
      }
      if (frequency === 1) {
        return 'every week';
      }
      return `every ${frequency} weeks`;
    }
    
    // Handle "Months" period
    if (this.period === 'Months') {
      if (this.monthlyType === 'week') {
        const selectedDayNames = this.getSelectedDayNames();
        const dayStr = selectedDayNames.length > 0 ? selectedDayNames[0] : 'day';
        const weekStr = this.selectedWeek.toLowerCase();
        if (frequency === 1) {
          return `${weekStr} ${dayStr} of the month`;
        }
        return `${weekStr} ${dayStr} every ${frequency} months`;
      } else {
        if (frequency === 1) {
          return `day ${this.selectedDayOfMonth} of the month`;
        }
        return `day ${this.selectedDayOfMonth} every ${frequency} months`;
      }
    }
    
    // Handle "Quarters" period
    if (this.period === 'Quarters') {
      if (frequency === 1) {
        return 'every quarter';
      }
      return `every ${frequency} quarters`;
    }
    
    // Handle "Years" period
    if (this.period === 'Years') {
      const monthStr = this.selectedMonth;
      const dayStr = this.selectedDayOfMonth;
      if (frequency === 1) {
        return `${monthStr} ${dayStr} every year`;
      }
      return `${monthStr} ${dayStr} every ${frequency} years`;
    }
    
    // Handle "Days after" period
    if (this.period === 'Days after') {
      if (frequency === 1) {
        return '1 day after completion';
      }
      return `${frequency} days after completion`;
    }
    
    return `every ${frequency} ${period}`;
  }

  getSelectedDayNames(): string[] {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return this.selectedDays
      .map((selected, index) => selected ? shortDayNames[index] : null)
      .filter(day => day !== null) as string[];
  }

  previousMonth() {
    // Go to previous month
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
    this.currentMonth = this.monthNames[this.currentDate.getMonth()];
    this.currentYear = this.currentDate.getFullYear().toString();
    this.generateCalendar();
  }

  nextMonth() {
    // Go to next month
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
    this.currentMonth = this.monthNames[this.currentDate.getMonth()];
    this.currentYear = this.currentDate.getFullYear().toString();
    this.generateCalendar();
  }
}








