import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast, ToastType } from '../../services/toast.service';
import { IconComponent } from './icons.component';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 pointer-events-none items-center">
      @for (toast of toastService.toasts(); track toast.id) {
        <div 
          class="relative flex items-start gap-3 w-[360px] max-w-[90vw] p-4 bg-white rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 pointer-events-auto transition-all duration-300 transform animate-fade-in-down overflow-hidden group"
          role="alert"
        >
          <!-- Left accent border color -->
          <div class="absolute left-0 top-0 bottom-0 w-1" [ngClass]="getAccentBgColor(toast.type)"></div>

          <!-- Icon -->
          <div class="shrink-0 pt-0.5">
             <app-icon [name]="getIconName(toast.type)" [class]="getTextColor(toast.type)" [size]="20"></app-icon>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0 pr-4">
             <h4 class="text-[15px] font-bold" [ngClass]="getTextColor(toast.type)">{{ toast.title || getDefaultTitle(toast.type) }}</h4>
             <p class="text-[13px] text-slate-700 mt-1 leading-snug font-medium">{{ toast.message }}</p>
          </div>

          <!-- Close Button -->
          <button 
            type="button" 
            (click)="toastService.remove(toast.id)"
            class="absolute top-4 right-3 shrink-0 text-slate-300 hover:text-slate-500 focus:outline-none transition-colors"
          >
             <app-icon name="x" [size]="16"></app-icon>
          </button>

          <!-- Progress Bar underneath -->
          <div 
            class="absolute bottom-0 left-0 h-[3px]" 
            [ngClass]="getAccentBgColor(toast.type)"
            [style.animation]="'toast-progress ' + toast.durationMs + 'ms linear forwards'"
          ></div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes toast-progress {
      from { width: 100%; }
      to { width: 0%; }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);

  getAccentBgColor(type: ToastType): string {
    switch (type) {
      case 'success': return 'bg-emerald-500';
      case 'error': return 'bg-rose-500';
      case 'warning': return 'bg-amber-500';
      case 'info': return 'bg-blue-500';
    }
  }

  getTextColor(type: ToastType): string {
    switch (type) {
      case 'success': return 'text-emerald-600';
      case 'error': return 'text-rose-600';
      case 'warning': return 'text-amber-600';
      case 'info': return 'text-blue-600';
    }
  }

  getDefaultTitle(type: ToastType): string {
    switch (type) {
      case 'success': return 'Éxito';
      case 'error': return 'Error';
      case 'warning': return 'Advertencia';
      case 'info': return 'Información';
    }
  }

  getIconName(type: ToastType): string {
    switch (type) {
      case 'success': return 'check-circle';
      case 'error': return 'alert-circle';
      case 'warning': return 'alert-triangle';
      case 'info': return 'info';
    }
  }
}
