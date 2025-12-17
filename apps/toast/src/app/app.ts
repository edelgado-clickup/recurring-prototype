import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { ThemeToggleComponent } from '@prototypes/theme-toggle';

interface Toast {
  id: number;
  isHovering: boolean;
  timeout?: number;
}

@Component({
  selector: 'app-root',
  imports: [ThemeToggleComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(-100%)',
          marginTop: '-70px' // Offset to push others down as it enters
        }),
        animate('300ms ease-out', style({
          opacity: 1,
          transform: 'translateY(0)',
          marginTop: '0px'
        }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({
          opacity: 0
        }))
      ])
    ])
  ]
})
export class App {
  toasts: Toast[] = [];
  private nextId = 1;

  openToast() {
    const toast: Toast = {
      id: this.nextId++,
      isHovering: false
    };

    // Add toast to the beginning (top of stack)
    this.toasts.unshift(toast);

    // Set auto-dismiss timer
    this.startAutoHideTimer(toast);
  }

  closeToast(toastId: number) {
    const toast = this.toasts.find(t => t.id === toastId);
    if (toast?.timeout) {
      clearTimeout(toast.timeout);
    }
    this.toasts = this.toasts.filter(t => t.id !== toastId);
  }

  onToastHover(toastId: number) {
    const toast = this.toasts.find(t => t.id === toastId);
    if (toast) {
      toast.isHovering = true;
      // Clear the auto-dismiss timeout when hovering
      if (toast.timeout) {
        clearTimeout(toast.timeout);
        toast.timeout = undefined;
      }
    }
  }

  onToastLeave(toastId: number) {
    const toast = this.toasts.find(t => t.id === toastId);
    if (toast) {
      toast.isHovering = false;
      // Clear any existing timer, then restart for 2s
      if (toast.timeout) {
        clearTimeout(toast.timeout);
      }
      toast.timeout = window.setTimeout(() => {
        this.closeToast(toastId);
      }, 2000);
    }
  }

  private startAutoHideTimer(toast: Toast) {
    // Auto-hide after 5 seconds
    toast.timeout = window.setTimeout(() => {
      this.closeToast(toast.id);
    }, 5000);
  }

  trackByToastId(index: number, toast: Toast): number {
    return toast.id;
  }
}

