import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../components/ui/icons.component';

@Component({
  selector: 'app-email-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div class="bg-white p-8 md:p-12 rounded-3xl shadow-xl w-full max-w-md border border-slate-100 text-center relative overflow-hidden">
        
        @if (isLoading()) {
          <!-- Loading State -->
          <div class="py-12 flex flex-col items-center animate-fade-in">
             <div class="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
             <h2 class="text-xl font-semibold text-slate-800">Verificando enlace...</h2>
             <p class="text-slate-500 mt-2">Por favor espera un momento.</p>
          </div>
        } @else {
          <!-- Success State -->
          <div class="animate-scale-in">
            <!-- Decorative Background Element -->
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"></div>

            <div class="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <app-icon name="check-circle" [size]="40" class="text-emerald-500"></app-icon>
            </div>

            <h1 class="text-2xl font-bold text-slate-900 mb-2">¡Correo Verificado!</h1>
            <p class="text-slate-500 mb-8 leading-relaxed">
              Gracias por confirmar tu identidad. Tu cuenta en <span class="font-semibold text-indigo-700">dokqet</span> ha sido activada correctamente.
            </p>

            <div class="bg-slate-50 rounded-xl p-4 mb-8 border border-slate-100 text-left">
               <div class="flex items-start gap-3">
                  <app-icon name="shield" [size]="20" class="text-indigo-600 mt-0.5"></app-icon>
                  <div>
                     <h3 class="text-sm font-bold text-slate-700">Acceso Seguro Habilitado</h3>
                     <p class="text-xs text-slate-500 mt-1">Ya puedes acceder a todos los módulos de gestión y expedientes.</p>
                  </div>
               </div>
            </div>

            <a routerLink="/login" 
               class="inline-flex w-full items-center justify-center gap-2 py-3.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 active:scale-[0.98] transition-all">
              <span>Iniciar Sesión</span>
              <app-icon name="chevron-right" [size]="18"></app-icon>
            </a>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out;
    }
    .animate-scale-in {
      animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
  `]
})
export class EmailConfirmationComponent implements OnInit {
  isLoading = signal(true);

  ngOnInit() {
    // Simulate API verification delay
    setTimeout(() => {
      this.isLoading.set(false);
    }, 1500);
  }
}