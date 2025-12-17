import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from '@prototypes/theme-toggle';
import { SupernovaAssets } from '../assets/supernova/assets';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ThemeToggleComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // Expose Supernova assets to template
  SupernovaAssets = SupernovaAssets;
  
  // Cover image reposition state
  isRepositioning = false;
  backgroundPosition = { x: 50, y: 50 }; // Percentage values
  isDragging = false;
  
  startReposition() {
    this.isRepositioning = true;
  }
  
  cancelReposition() {
    this.isRepositioning = false;
    this.isDragging = false;
  }
  
  savePosition() {
    this.isRepositioning = false;
    this.isDragging = false;
    // Position is already updated via drag
    console.log('Saved position:', this.backgroundPosition);
  }
  
  onDragStart(event: MouseEvent) {
    if (!this.isRepositioning) return;
    this.isDragging = true;
    event.preventDefault();
  }
  
  onDrag(event: MouseEvent, coverElement: HTMLElement) {
    if (!this.isDragging || !this.isRepositioning) return;
    
    const rect = coverElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    // Clamp values between 0 and 100
    this.backgroundPosition = {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y))
    };
  }
  
  onDragEnd() {
    this.isDragging = false;
  }
  
  getBackgroundPosition(): string {
    return `${this.backgroundPosition.x}% ${this.backgroundPosition.y}%`;
  }
}

