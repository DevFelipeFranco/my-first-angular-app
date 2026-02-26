import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 class="text-2xl font-bold text-slate-800 mb-4">Configuración</h2>
        <p class="text-slate-500 mb-8">Administra tus preferencias y configuración de cuenta.</p>
        
        <div class="space-y-6 max-w-2xl">
          <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <h3 class="font-medium text-slate-800">Notificaciones</h3>
              <p class="text-sm text-slate-500">Recibir alertas por correo electrónico</p>
            </div>
            <div class="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full bg-indigo-600 cursor-pointer">
              <span class="absolute left-0 inline-block w-6 h-6 bg-white border-2 border-indigo-600 rounded-full shadow transform translate-x-6 transition-transform duration-200 ease-in-out"></span>
            </div>
          </div>

          <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <h3 class="font-medium text-slate-800">Modo Oscuro</h3>
              <p class="text-sm text-slate-500">Cambiar la apariencia del dashboard</p>
            </div>
            <div class="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full bg-slate-300 cursor-pointer">
              <span class="absolute left-0 inline-block w-6 h-6 bg-white border-2 border-slate-300 rounded-full shadow transform transition-transform duration-200 ease-in-out"></span>
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
export class SettingsComponent {}