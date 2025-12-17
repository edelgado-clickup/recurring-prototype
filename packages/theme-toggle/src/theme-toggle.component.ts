import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss'
})
export class ThemeToggleComponent {
  isDarkMode = false;

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('dark-theme', this.isDarkMode);
  }

  // Public method to get current theme state
  get currentTheme(): 'light' | 'dark' {
    return this.isDarkMode ? 'dark' : 'light';
  }
}


