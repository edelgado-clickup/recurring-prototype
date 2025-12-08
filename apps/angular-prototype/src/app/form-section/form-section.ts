import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupernovaAssets } from '../../assets/supernova/assets';

@Component({
  selector: 'app-form-section',
  imports: [CommonModule, FormsModule],
  templateUrl: './form-section.html',
  styleUrl: './form-section.scss',
})
export class FormSection {
  // Expose SupernovaAssets to the template
  SupernovaAssets = SupernovaAssets;
  
  // Calendar picker and recurring task logic

  // Recurring mode state
  isRecurringMode = false;
  showTimeField = false; // Track if time field is shown

  // Recurring form data
  recurringData = {
    trigger: 'complete',
    repeatEvery: 1,
    repeatUnit: 'week',
    repeatOn: ['W'] as string[],
    time: '08:00',
    endsOn: 'never',
    endsAfter: 10,
    endsDate: ''
  };

  // Toggle recurring mode
  showRecurringForm() {
    this.isRecurringMode = true;
    this.showTimeField = false; // Reset time field when opening
  }

  toggleWeekday(day: string) {
    const index = this.recurringData.repeatOn.indexOf(day);
    if (index > -1) {
      this.recurringData.repeatOn.splice(index, 1);
    } else {
      this.recurringData.repeatOn.push(day);
    }
  }

  // Add time field
  addTimeField() {
    this.showTimeField = true;
  }

  // Remove time field
  removeTimeField() {
    this.showTimeField = false;
    this.recurringData.time = '08:00'; // Reset to default
  }

  cancelRecurring() {
    this.isRecurringMode = false;
    this.showTimeField = false;
    // Reset form data
    this.recurringData = {
      trigger: 'complete',
      repeatEvery: 1,
      repeatUnit: 'week',
      repeatOn: ['W'],
      time: '08:00',
      endsOn: 'never',
      endsAfter: 10,
      endsDate: ''
    };
  }

  saveRecurring() {
    console.log('Recurring settings saved:', this.recurringData);
    this.isRecurringMode = false;
    // Here you would typically save to a backend or emit an event
  }
}

