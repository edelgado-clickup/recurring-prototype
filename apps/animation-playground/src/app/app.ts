import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate as ngAnimate, state, keyframes } from '@angular/animations';
import { animate } from 'motion';

interface AnimationCard {
  id: string;
  name: string;
  description: string;
  duration: number; // in ms
  easing: string;
  bezier: number[]; // [x1, y1, x2, y2]
}

interface MotionCard {
  id: string;
  name: string;
  description: string;
  type: 'spring' | 'tween';
  duration: number; // in ms
  bezier: number[]; // [x1, y1, x2, y2]
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  animations: [
    // 1. Fade In
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        ngAnimate('300ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    
    // 2. Fade In Up
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        ngAnimate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    
    // 3. Fade In Down
    trigger('fadeInDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        ngAnimate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    
    // 4. Slide In Left
    trigger('slideInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-30px)' }),
        ngAnimate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    
    // 5. Slide In Right
    trigger('slideInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(30px)' }),
        ngAnimate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    
    // 6. Scale In
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        ngAnimate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    
    // 7. Scale In Bounce
    trigger('scaleInBounce', [
      transition(':enter', [
        ngAnimate('400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)', keyframes([
          style({ opacity: 0, transform: 'scale(0.5)', offset: 0 }),
          style({ opacity: 1, transform: 'scale(1.05)', offset: 0.7 }),
          style({ opacity: 1, transform: 'scale(1)', offset: 1 })
        ]))
      ])
    ]),
    
    // 8. Bounce
    trigger('bounce', [
      transition(':enter', [
        ngAnimate('600ms ease-out', keyframes([
          style({ opacity: 0, transform: 'translateY(-40px)', offset: 0 }),
          style({ opacity: 1, transform: 'translateY(0)', offset: 0.4 }),
          style({ transform: 'translateY(-15px)', offset: 0.6 }),
          style({ transform: 'translateY(0)', offset: 0.75 }),
          style({ transform: 'translateY(-5px)', offset: 0.9 }),
          style({ transform: 'translateY(0)', offset: 1 })
        ]))
      ])
    ]),
    
    // 9. Rotate In
    trigger('rotateIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'rotate(-180deg) scale(0.5)' }),
        ngAnimate('400ms ease-out', style({ opacity: 1, transform: 'rotate(0) scale(1)' }))
      ])
    ]),
    
    // 10. Flip In X
    trigger('flipInX', [
      transition(':enter', [
        style({ opacity: 0, transform: 'perspective(400px) rotateX(90deg)' }),
        ngAnimate('400ms ease-out', style({ opacity: 1, transform: 'perspective(400px) rotateX(0)' }))
      ])
    ]),
    
    // 11. Flip In Y
    trigger('flipInY', [
      transition(':enter', [
        style({ opacity: 0, transform: 'perspective(400px) rotateY(90deg)' }),
        ngAnimate('400ms ease-out', style({ opacity: 1, transform: 'perspective(400px) rotateY(0)' }))
      ])
    ]),
    
    // 12. Zoom In
    trigger('zoomIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.3)' }),
        ngAnimate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    
    // 13. Shake (on state change)
    trigger('shake', [
      state('idle', style({ transform: 'translateX(0)' })),
      state('shaking', style({ transform: 'translateX(0)' })),
      transition('idle => shaking', [
        ngAnimate('500ms ease-in-out', keyframes([
          style({ transform: 'translateX(0)', offset: 0 }),
          style({ transform: 'translateX(-10px)', offset: 0.1 }),
          style({ transform: 'translateX(10px)', offset: 0.2 }),
          style({ transform: 'translateX(-10px)', offset: 0.3 }),
          style({ transform: 'translateX(10px)', offset: 0.4 }),
          style({ transform: 'translateX(-10px)', offset: 0.5 }),
          style({ transform: 'translateX(10px)', offset: 0.6 }),
          style({ transform: 'translateX(-5px)', offset: 0.7 }),
          style({ transform: 'translateX(5px)', offset: 0.8 }),
          style({ transform: 'translateX(0)', offset: 1 })
        ]))
      ])
    ]),
    
    // 14. Pulse (on state change)
    trigger('pulse', [
      state('idle', style({ transform: 'scale(1)' })),
      state('pulsing', style({ transform: 'scale(1)' })),
      transition('idle => pulsing', [
        ngAnimate('500ms ease-in-out', keyframes([
          style({ transform: 'scale(1)', offset: 0 }),
          style({ transform: 'scale(1.15)', offset: 0.5 }),
          style({ transform: 'scale(1)', offset: 1 })
        ]))
      ])
    ]),
    
    // 15. Swing
    trigger('swing', [
      state('idle', style({ transform: 'rotate(0)' })),
      state('swinging', style({ transform: 'rotate(0)' })),
      transition('idle => swinging', [
        ngAnimate('600ms ease-in-out', keyframes([
          style({ transform: 'rotate(0)', offset: 0 }),
          style({ transform: 'rotate(15deg)', offset: 0.2 }),
          style({ transform: 'rotate(-10deg)', offset: 0.4 }),
          style({ transform: 'rotate(5deg)', offset: 0.6 }),
          style({ transform: 'rotate(-5deg)', offset: 0.8 }),
          style({ transform: 'rotate(0)', offset: 1 })
        ]))
      ])
    ]),
    
    // 16. Rubber Band
    trigger('rubberBand', [
      state('idle', style({ transform: 'scale(1)' })),
      state('stretching', style({ transform: 'scale(1)' })),
      transition('idle => stretching', [
        ngAnimate('700ms ease-in-out', keyframes([
          style({ transform: 'scale(1, 1)', offset: 0 }),
          style({ transform: 'scale(1.25, 0.75)', offset: 0.3 }),
          style({ transform: 'scale(0.75, 1.25)', offset: 0.4 }),
          style({ transform: 'scale(1.15, 0.85)', offset: 0.5 }),
          style({ transform: 'scale(0.95, 1.05)', offset: 0.65 }),
          style({ transform: 'scale(1.05, 0.95)', offset: 0.75 }),
          style({ transform: 'scale(1, 1)', offset: 1 })
        ]))
      ])
    ])
  ]
})
export class App {
  activeTab: 'angular' | 'motion' | 'showcase' | 'playground' = 'angular';
  
  // Animation states for interactive animations
  animationStates: { [key: string]: string } = {};
  visibleCards: { [key: string]: boolean } = {};
  isAnimating = false;
  
  // Angular Animations
  angularAnimations: AnimationCard[] = [
    { id: 'fadeIn', name: 'Fade In', description: 'Simple opacity transition from 0 to 1', duration: 300, easing: 'ease-out', bezier: [0, 0, 0.58, 1] },
    { id: 'fadeInUp', name: 'Fade In Up', description: 'Fade in while sliding up from below', duration: 300, easing: 'ease-out', bezier: [0, 0, 0.58, 1] },
    { id: 'fadeInDown', name: 'Fade In Down', description: 'Fade in while sliding down from above', duration: 300, easing: 'ease-out', bezier: [0, 0, 0.58, 1] },
    { id: 'slideInLeft', name: 'Slide In Left', description: 'Slide in from the left side', duration: 300, easing: 'ease-out', bezier: [0, 0, 0.58, 1] },
    { id: 'slideInRight', name: 'Slide In Right', description: 'Slide in from the right side', duration: 300, easing: 'ease-out', bezier: [0, 0, 0.58, 1] },
    { id: 'scaleIn', name: 'Scale In', description: 'Scale up from smaller size', duration: 300, easing: 'ease-out', bezier: [0, 0, 0.58, 1] },
    { id: 'scaleInBounce', name: 'Scale In Bounce', description: 'Scale in with a bouncy overshoot', duration: 400, easing: 'cubic-bezier', bezier: [0.175, 0.885, 0.32, 1.275] },
    { id: 'bounce', name: 'Bounce', description: 'Drop in with realistic bounce effect', duration: 600, easing: 'ease-out', bezier: [0, 0, 0.58, 1] },
    { id: 'rotateIn', name: 'Rotate In', description: 'Spin in while scaling up', duration: 400, easing: 'ease-out', bezier: [0, 0, 0.58, 1] },
    { id: 'flipInX', name: 'Flip In X', description: '3D flip around X-axis', duration: 400, easing: 'ease-out', bezier: [0, 0, 0.58, 1] },
    { id: 'flipInY', name: 'Flip In Y', description: '3D flip around Y-axis', duration: 400, easing: 'ease-out', bezier: [0, 0, 0.58, 1] },
    { id: 'zoomIn', name: 'Zoom In', description: 'Dramatic zoom from small to full size', duration: 300, easing: 'ease-out', bezier: [0, 0, 0.58, 1] },
    { id: 'shake', name: 'Shake', description: 'Attention-grabbing horizontal shake', duration: 500, easing: 'ease-in-out', bezier: [0.42, 0, 0.58, 1] },
    { id: 'pulse', name: 'Pulse', description: 'Subtle scale pulse effect', duration: 500, easing: 'ease-in-out', bezier: [0.42, 0, 0.58, 1] },
    { id: 'swing', name: 'Swing', description: 'Pendulum-like swinging motion', duration: 600, easing: 'ease-in-out', bezier: [0.42, 0, 0.58, 1] },
    { id: 'rubberBand', name: 'Rubber Band', description: 'Elastic stretch and snap effect', duration: 700, easing: 'ease-in-out', bezier: [0.42, 0, 0.58, 1] }
  ];

  // Motion One Animations
  motionAnimations: MotionCard[] = [
    { id: 'spring-scale', name: 'Spring Scale', description: 'Natural spring-based scale animation', type: 'spring', duration: 600, bezier: [0.175, 0.885, 0.32, 1.275] },
    { id: 'spring-bounce', name: 'Spring Bounce', description: 'Bouncy spring with high stiffness', type: 'spring', duration: 500, bezier: [0.68, -0.55, 0.265, 1.55] },
    { id: 'spring-wobbly', name: 'Spring Wobbly', description: 'Low damping for wobbly effect', type: 'spring', duration: 800, bezier: [0.175, 0.885, 0.32, 1.275] },
    { id: 'spring-gentle', name: 'Spring Gentle', description: 'Soft, gentle spring motion', type: 'spring', duration: 700, bezier: [0.25, 0.46, 0.45, 0.94] },
    { id: 'tween-fade', name: 'Tween Fade', description: 'Simple opacity tween', type: 'tween', duration: 300, bezier: [0.25, 0.1, 0.25, 1] },
    { id: 'tween-slide', name: 'Tween Slide', description: 'Smooth slide animation', type: 'tween', duration: 400, bezier: [0.25, 0.1, 0.25, 1] },
    { id: 'tween-rotate', name: 'Tween Rotate', description: 'Rotation with easing', type: 'tween', duration: 500, bezier: [0.42, 0, 0.58, 1] },
    { id: 'spring-pop', name: 'Spring Pop', description: 'Quick pop-in effect', type: 'spring', duration: 400, bezier: [0.175, 0.885, 0.32, 1.275] },
    { id: 'spring-slide', name: 'Spring Slide', description: 'Spring-based slide motion', type: 'spring', duration: 500, bezier: [0.175, 0.885, 0.32, 1.275] },
    { id: 'tween-scale', name: 'Tween Scale', description: 'Smooth scale with easing', type: 'tween', duration: 300, bezier: [0.25, 0.1, 0.25, 1] },
    { id: 'spring-shake', name: 'Spring Shake', description: 'Springy shake effect', type: 'spring', duration: 500, bezier: [0.36, 0.07, 0.19, 0.97] },
    { id: 'tween-flip', name: 'Tween Flip', description: '3D flip with perspective', type: 'tween', duration: 600, bezier: [0.175, 0.885, 0.32, 1.275] },
  ];

  // Showcase: Carousel
  carouselIndex = 0;
  carouselItems = [
    { color: '#6366f1', label: 'Slide 1' },
    { color: '#8b5cf6', label: 'Slide 2' },
    { color: '#a855f7', label: 'Slide 3' },
    { color: '#d946ef', label: 'Slide 4' },
  ];
  carouselSettings = { duration: 400, bezier: [0.25, 0.1, 0.25, 1] };

  // Showcase: Notifications
  notifications: { id: number; message: string; type: string }[] = [];
  notificationId = 0;
  notificationSettings = { duration: 300, bezier: [0.175, 0.885, 0.32, 1.275] };

  // Showcase: Todo List
  todos = [
    { id: 1, text: 'Learn Motion animations', done: false },
    { id: 2, text: 'Build awesome UI', done: false },
    { id: 3, text: 'Ship to production', done: false },
  ];
  todoSettings = { duration: 200, bezier: [0.25, 0.1, 0.25, 1] };

  // Showcase: Tabs
  showcaseTabIndex = 0;
  showcaseTabs = ['Home', 'Profile', 'Settings', 'Help'];
  tabSettings = { duration: 300, bezier: [0.25, 0.1, 0.25, 1] };

  // Showcase: Tilt Card
  tiltX = 0;
  tiltY = 0;
  tiltSettings = { duration: 100, bezier: [0.25, 0.1, 0.25, 1] };

  constructor(private cdr: ChangeDetectorRef) {
    // Initialize all cards as visible and in idle state
    this.angularAnimations.forEach(anim => {
      this.visibleCards[anim.id] = true;
      this.animationStates[anim.id] = 'idle';
    });
  }

  setTab(tab: 'angular' | 'motion' | 'showcase' | 'playground') {
    this.activeTab = tab;
  }

  // Trigger entrance animation by toggling visibility
  playEntranceAnimation(id: string) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    this.visibleCards[id] = false;
    this.cdr.detectChanges();
    
    setTimeout(() => {
      this.visibleCards[id] = true;
      this.cdr.detectChanges();
      
      // Get duration from the animation card
      const anim = this.angularAnimations.find(a => a.id === id);
      const duration = anim ? anim.duration : 500;
      
      setTimeout(() => {
        this.isAnimating = false;
      }, duration + 100);
    }, 50);
  }

  // Trigger state-based animation
  playAngularAnimation(id: string) {
    const stateMap: { [key: string]: string } = {
      'shake': 'shaking',
      'pulse': 'pulsing',
      'swing': 'swinging',
      'rubberBand': 'stretching'
    };
    
    if (stateMap[id]) {
      this.animationStates[id] = 'idle';
      this.cdr.detectChanges();
      
      requestAnimationFrame(() => {
        this.animationStates[id] = stateMap[id];
        this.cdr.detectChanges();
        
        setTimeout(() => {
          this.animationStates[id] = 'idle';
          this.cdr.detectChanges();
        }, 1000);
      });
    } else {
      this.playEntranceAnimation(id);
    }
  }

  isStateAnimation(id: string): boolean {
    return ['shake', 'pulse', 'swing', 'rubberBand'].includes(id);
  }

  trackByAnimId(index: number, anim: AnimationCard | MotionCard): string {
    return anim.id;
  }

  // Motion One Animations - using keyframes for spring-like effects
  playMotionAnimation(id: string, event: Event) {
    const card = event.currentTarget as HTMLElement;
    const box = card.querySelector('.motion-box') as HTMLElement;
    
    if (!box) return;

    // Get the animation settings
    const anim = this.motionAnimations.find(a => a.id === id);
    const duration = anim ? anim.duration / 1000 : 0.5; // Convert ms to seconds
    const easing = anim ? anim.bezier as [number, number, number, number] : [0.25, 0.1, 0.25, 1];
    
    // Use type assertion for Motion's animate function
    const motionAnimate = animate as any;

    switch (id) {
      case 'spring-scale':
        // Spring-like scale with overshoot
        motionAnimate(box, 
          { scale: [0.5, 1.1, 0.95, 1.02, 1] }, 
          { duration, easing }
        );
        break;
        
      case 'spring-bounce':
        // Bouncy drop animation
        motionAnimate(box, 
          { 
            scale: [0.3, 1.05, 0.98, 1],
            y: [-30, 5, -2, 0]
          }, 
          { duration, easing }
        );
        break;
        
      case 'spring-wobbly':
        // Wobbly rotation
        motionAnimate(box, 
          { rotate: [0, 15, -12, 8, -5, 3, 0] }, 
          { duration, easing }
        );
        break;
        
      case 'spring-gentle':
        // Gentle spring fade-in
        motionAnimate(box, 
          { 
            scale: [0.8, 1.02, 1],
            opacity: [0, 1, 1]
          }, 
          { duration, easing }
        );
        break;
        
      case 'tween-fade':
        // Simple opacity fade
        motionAnimate(box, 
          { opacity: [0, 1] }, 
          { duration, easing }
        );
        break;
        
      case 'tween-slide':
        // Slide in from left
        motionAnimate(box, 
          { x: [-40, 0], opacity: [0, 1] }, 
          { duration, easing }
        );
        break;
        
      case 'tween-rotate':
        // Rotate with scale
        motionAnimate(box, 
          { rotate: [180, 0], scale: [0.5, 1] }, 
          { duration, easing }
        );
        break;
        
      case 'spring-pop':
        // Pop in with bounce
        motionAnimate(box, 
          { scale: [0, 1.2, 0.9, 1.05, 1] }, 
          { duration, easing }
        );
        break;
        
      case 'spring-slide':
        // Spring slide from left
        motionAnimate(box, 
          { x: [-50, 5, -2, 0] }, 
          { duration, easing }
        );
        break;
        
      case 'tween-scale':
        // Scale with bounce easing
        motionAnimate(box, 
          { scale: [0.3, 1], opacity: [0, 1] }, 
          { duration, easing }
        );
        break;
        
      case 'spring-shake':
        // Shake animation
        motionAnimate(box, 
          { x: [0, -15, 15, -10, 10, -5, 5, 0] }, 
          { duration, easing }
        );
        break;
        
      case 'tween-flip':
        // 3D flip
        motionAnimate(box, 
          { rotateY: [90, 0], opacity: [0, 1] }, 
          { duration, easing }
        );
        break;
    }
  }

  // ============ SHOWCASE METHODS ============

  // Carousel
  nextSlide(carouselEl: HTMLElement) {
    const motionAnimate = animate as any;
    const track = carouselEl.querySelector('.carousel-track') as HTMLElement;
    
    this.carouselIndex = (this.carouselIndex + 1) % this.carouselItems.length;
    const offset = -this.carouselIndex * 100;
    
    motionAnimate(track, 
      { x: `${offset}%` }, 
      { duration: this.carouselSettings.duration / 1000, easing: this.carouselSettings.bezier }
    );
  }

  prevSlide(carouselEl: HTMLElement) {
    const motionAnimate = animate as any;
    const track = carouselEl.querySelector('.carousel-track') as HTMLElement;
    
    this.carouselIndex = this.carouselIndex === 0 
      ? this.carouselItems.length - 1 
      : this.carouselIndex - 1;
    const offset = -this.carouselIndex * 100;
    
    motionAnimate(track, 
      { x: `${offset}%` }, 
      { duration: this.carouselSettings.duration / 1000, easing: this.carouselSettings.bezier }
    );
  }

  // Notifications
  addNotification() {
    const types = ['success', 'info', 'warning'];
    const messages = [
      'Task completed successfully!',
      'New message received',
      'Don\'t forget to save',
      'Update available',
      'Welcome back!'
    ];
    
    const notification = {
      id: ++this.notificationId,
      message: messages[Math.floor(Math.random() * messages.length)],
      type: types[Math.floor(Math.random() * types.length)]
    };
    
    this.notifications.unshift(notification);
    this.cdr.detectChanges();

    // Animate the new notification
    setTimeout(() => {
      const el = document.querySelector(`[data-notification-id="${notification.id}"]`) as HTMLElement;
      if (el) {
        const motionAnimate = animate as any;
        motionAnimate(el, 
          { x: [300, -10, 0], opacity: [0, 1, 1] }, 
          { duration: this.notificationSettings.duration / 1000, easing: this.notificationSettings.bezier }
        );
      }
    }, 10);

    // Auto-remove after 3 seconds
    setTimeout(() => this.dismissNotification(notification.id), 3000);
  }

  dismissNotification(id: number) {
    const el = document.querySelector(`[data-notification-id="${id}"]`) as HTMLElement;
    if (el) {
      const motionAnimate = animate as any;
      motionAnimate(el, 
        { x: [0, 300], opacity: [1, 0] }, 
        { duration: this.notificationSettings.duration / 1000, easing: this.notificationSettings.bezier }
      ).then(() => {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.cdr.detectChanges();
      });
    }
  }

  // Todo List
  toggleTodo(todo: { id: number; text: string; done: boolean }) {
    const el = document.querySelector(`[data-todo-id="${todo.id}"]`) as HTMLElement;
    const checkbox = el?.querySelector('.todo-checkbox') as HTMLElement;
    
    todo.done = !todo.done;
    const duration = this.todoSettings.duration / 1000;
    const easing = this.todoSettings.bezier;
    
    if (checkbox) {
      const motionAnimate = animate as any;
      if (todo.done) {
        motionAnimate(checkbox, 
          { scale: [1, 1.3, 1], backgroundColor: ['#e5e7eb', '#22c55e'] }, 
          { duration, easing }
        );
        motionAnimate(el, 
          { opacity: [1, 0.6] }, 
          { duration, easing }
        );
      } else {
        motionAnimate(checkbox, 
          { scale: [1, 0.8, 1], backgroundColor: ['#22c55e', '#e5e7eb'] }, 
          { duration, easing }
        );
        motionAnimate(el, 
          { opacity: [0.6, 1] }, 
          { duration, easing }
        );
      }
    }
  }

  addTodo() {
    const newTodo = {
      id: Date.now(),
      text: `New task ${this.todos.length + 1}`,
      done: false
    };
    this.todos.push(newTodo);
    this.cdr.detectChanges();

    setTimeout(() => {
      const el = document.querySelector(`[data-todo-id="${newTodo.id}"]`) as HTMLElement;
      if (el) {
        const motionAnimate = animate as any;
        motionAnimate(el, 
          { height: [0, 56], opacity: [0, 1], y: [-20, 0] }, 
          { duration: this.todoSettings.duration / 1000, easing: this.todoSettings.bezier }
        );
      }
    }, 10);
  }

  // Tab Select
  selectShowcaseTab(index: number, tabsEl: HTMLElement) {
    const motionAnimate = animate as any;
    const indicator = tabsEl.querySelector('.tab-indicator') as HTMLElement;
    const buttons = tabsEl.querySelectorAll('.showcase-tab-btn');
    
    if (indicator && buttons[index]) {
      const btn = buttons[index] as HTMLElement;
      const tabsRect = tabsEl.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      
      const left = btnRect.left - tabsRect.left;
      const width = btnRect.width;
      
      motionAnimate(indicator, 
        { left: `${left}px`, width: `${width}px` }, 
        { duration: this.tabSettings.duration / 1000, easing: this.tabSettings.bezier }
      );
    }
    
    this.showcaseTabIndex = index;
  }

  // Tilt Card
  onTiltMove(event: MouseEvent, cardEl: HTMLElement) {
    const rect = cardEl.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate tilt (max 15 degrees)
    this.tiltX = ((y - centerY) / centerY) * -15;
    this.tiltY = ((x - centerX) / centerX) * 15;
    
    const motionAnimate = animate as any;
    const tiltInner = cardEl.querySelector('.tilt-inner') as HTMLElement;
    
    if (tiltInner) {
      motionAnimate(tiltInner, 
        { rotateX: this.tiltX, rotateY: this.tiltY }, 
        { duration: this.tiltSettings.duration / 1000, easing: this.tiltSettings.bezier }
      );
    }
  }

  onTiltLeave(cardEl: HTMLElement) {
    const motionAnimate = animate as any;
    const tiltInner = cardEl.querySelector('.tilt-inner') as HTMLElement;
    
    if (tiltInner) {
      motionAnimate(tiltInner, 
        { rotateX: 0, rotateY: 0 }, 
        { duration: this.tiltSettings.duration / 1000 * 3, easing: this.tiltSettings.bezier }
      );
    }
    
    this.tiltX = 0;
    this.tiltY = 0;
  }
}
