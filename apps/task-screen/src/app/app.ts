import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from '@prototypes/theme-toggle';
import { SupernovaAssets } from '../assets/supernova/assets';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ThemeToggleComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // Expose Supernova assets to template
  SupernovaAssets = SupernovaAssets;
  
  title = 'Task Screen Prototype';
}
