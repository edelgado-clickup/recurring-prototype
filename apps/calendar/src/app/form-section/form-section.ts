import { Component } from '@angular/core';
import { ThemeToggleComponent } from '@prototypes/theme-toggle';
import { SupernovaAssets } from '../../assets/supernova/assets';

@Component({
  selector: 'app-form-section',
  imports: [ThemeToggleComponent],
  templateUrl: './form-section.html',
  styleUrl: './form-section.scss',
})
export class FormSection {
  // Expose SupernovaAssets to the template
  SupernovaAssets = SupernovaAssets;
}

