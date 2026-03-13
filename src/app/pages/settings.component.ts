import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-300">
        <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Configuración</h2>
        <p class="text-slate-500 dark:text-slate-400 mb-8">Administra tus preferencias y configuración de cuenta.</p>
        
        <div class="space-y-6 max-w-2xl">
          <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-600 transition-colors duration-300">
            <div>
              <h3 class="font-medium text-slate-800 dark:text-slate-200">Notificaciones</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">Recibir alertas por correo electrónico</p>
            </div>
            <div class="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full bg-indigo-600 cursor-pointer">
              <span class="absolute left-0 inline-block w-6 h-6 bg-white border-2 border-indigo-600 rounded-full shadow transform translate-x-6 transition-transform duration-200 ease-in-out"></span>
            </div>
          </div>

          <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-600 transition-colors duration-300">
            <div>
              <h3 class="font-medium text-slate-800 dark:text-slate-200">Modo Oscuro</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">Cambiar la apariencia del dashboard</p>
            </div>
            <div 
              (click)="themeService.toggleTheme()"
              class="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer"
              [class]="themeService.isDarkMode() ? 'bg-indigo-600' : 'bg-slate-300'">
              <span 
                class="absolute left-0 top-0 inline-block w-6 h-6 bg-white border-2 rounded-full shadow transform transition-transform duration-200 ease-in-out"
                [class]="themeService.isDarkMode() ? 'translate-x-6 border-indigo-600' : 'translate-x-0 border-slate-300'"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class SettingsComponent {
  themeService = inject(ThemeService);
}