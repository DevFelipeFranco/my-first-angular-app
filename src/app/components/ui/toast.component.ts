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
          class="flex items-center gap-3 w-80 max-w-sm p-4 rounded-xl shadow-2xl pointer-events-auto transition-all duration-300 transform border animate-fade-in-down"
          style="animation-duration: 0.3s;"
          [ngClass]="getBgColor(toast.type)"
          role="alert"
        >
          <div class="shrink-0">
             <app-icon [name]="getIconName(toast.type)" [class]="getIconColor(toast.type)" [size]="20"></app-icon>
          </div>
          <div class="flex-1">
             <p class="text-sm font-semibold text-slate-800">{{ toast.message }}</p>
          </div>
          <button 
            type="button" 
            (click)="toastService.remove(toast.id)"
            class="shrink-0 ml-2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
          >
             <app-icon name="x" [size]="16"></app-icon>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);

  getBgColor(type: ToastType): string {
    switch (type) {
      case 'success': return 'bg-emerald-50 border-emerald-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-amber-50 border-amber-200';
      case 'info': return 'bg-blue-50 border-blue-200';
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

  getIconColor(type: ToastType): string {
    switch (type) {
      case 'success': return 'text-emerald-500';
      case 'error': return 'text-red-500';
      case 'warning': return 'text-amber-500';
      case 'info': return 'text-blue-500';
    }
  }
}
