import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { IconComponent } from '../components/ui/icons.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, IconComponent],
  template: `
    <div class="min-h-screen flex flex-col md:flex-row-reverse bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900 border-x border-slate-200/50">
      
      <!-- Premium Back Button -->
      <a routerLink="/" class="absolute top-6 left-6 md:left-auto md:right-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 md:bg-white/60 backdrop-blur-md rounded-full text-slate-700 hover:text-indigo-700 shadow-sm hover:shadow-lg border border-slate-200/50 hover:border-indigo-200/60 transition-all duration-300 hover:-translate-x-1 md:hover:translate-x-1 group overflow-hidden">
         <div class="absolute inset-0 bg-gradient-to-r from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
         <app-icon name="chevron-right" class="rotate-180 md:rotate-0 transition-transform duration-300 md:group-hover:translate-x-1 md:order-last relative z-10" [size]="18" [strokeWidth]="2.5"></app-icon>
         <span class="text-sm font-semibold tracking-wide relative z-10 hidden sm:block">Volver al Inicio</span>
      </a>

      <!-- Decorative Brand Section (Hidden on small screens) -->
      <div class="hidden md:flex relative flex-1 bg-slate-900 items-center justify-center overflow-hidden">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')]"></div>
        <div class="absolute -top-[40%] text-white -right-[10%] w-[70%] h-[70%] rounded-full bg-blue-600/30 blur-[120px]"></div>
        <div class="absolute -bottom-[40%] text-white -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-600/30 blur-[120px]"></div>
        
        <div class="relative z-10 p-12 max-w-lg text-center animate-fade-in-up">
          <div class="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl mx-auto flex items-center justify-center mb-10 border border-white/20 shadow-2xl">
            <app-icon name="briefcase" class="text-white" [size]="40" [strokeWidth]="2"></app-icon>
          </div>
          <h2 class="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Digitaliza<br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">tu despacho</span>
          </h2>
          <p class="text-indigo-200/80 text-lg leading-relaxed font-medium">
            Únete a la nueva generación de abogados que gestionan sus expedientes con tecnología de punta.
          </p>

          <div class="mt-12 flex justify-center gap-2">
            <div class="flex -space-x-3">
              <div class="w-10 h-10 rounded-full bg-indigo-500 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-white uppercase z-30">CM</div>
              <div class="w-10 h-10 rounded-full bg-blue-500 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-white uppercase z-20">AL</div>
              <div class="w-10 h-10 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-white uppercase z-10">JS</div>
            </div>
            <div class="flex flex-col justify-center text-left ml-3">
              <span class="text-white font-bold text-sm">+5,000 abogados</span>
              <span class="text-indigo-200/70 text-xs">ya confían en nosotros</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Section -->
      <div class="flex-1 flex flex-col justify-center items-center relative bg-white px-6 py-12 lg:px-16 lg:py-24">
        
        <!-- Mobile Logo -->
        <div class="md:hidden flex flex-col items-center gap-4 mb-10 mt-12 animate-fade-in-up group cursor-pointer">
          <div class="w-16 h-16 flex items-center justify-center">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full drop-shadow-md transition-all duration-700 group-hover:drop-shadow-[0_8px_16px_rgba(220,38,38,0.5)]">
              <g class="origin-[45px_45px] transition-transform duration-[1.5s] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.12] group-hover:-rotate-3">
                <polygon points="6,24 16,14 16,24" fill="#ef4444" class="transition-all duration-[1.2s] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:-translate-x-2 group-hover:-translate-y-1 group-hover:-rotate-3" />
                <polygon points="18,12 36,12 36,38 18,38" fill="#ef4444" class="transition-all duration-[1.2s] ease-[cubic-bezier(0.2,0.8,0.2,1)] delay-[50ms] group-hover:-translate-x-1 group-hover:-translate-y-2 group-hover:-rotate-1 origin-[27px_25px]" />
                <polygon points="38,38 58,18 58,38" fill="#ef4444" class="transition-all duration-[1.2s] ease-[cubic-bezier(0.2,0.8,0.2,1)] delay-[75ms] group-hover:-translate-y-2 group-hover:rotate-1 origin-[48px_28px]" />
                <polygon points="60,4 90,4 60,34" fill="#ef4444" class="transition-all duration-[1.2s] ease-[cubic-bezier(0.2,0.8,0.2,1)] delay-[100ms] group-hover:translate-x-3 group-hover:-translate-y-3 group-hover:rotate-3 origin-[75px_19px]" />
                <polygon points="76,20 94,8 72,24" fill="#ef4444" class="transition-all duration-[1.2s] ease-[cubic-bezier(0.2,0.8,0.2,1)] delay-[150ms] group-hover:translate-x-4 group-hover:-translate-y-4 group-hover:rotate-6 origin-[83px_14px]" />
                <polygon points="20,40 56,40 44,76" fill="#ef4444" class="transition-all duration-[1.2s] ease-[cubic-bezier(0.2,0.8,0.2,1)] delay-[50ms] group-hover:translate-y-2 group-hover:scale-[1.03] origin-[40px_58px]" />
                <polygon points="58,42 40,96 58,96" fill="#ef4444" class="transition-all duration-[1.2s] ease-[cubic-bezier(0.2,0.8,0.2,1)] delay-[125ms] group-hover:translate-x-2 group-hover:translate-y-3 group-hover:-rotate-2 origin-[49px_69px]" />
              </g>
            </svg>
          </div>
          <span class="text-3xl font-extrabold text-[#022c22] tracking-tight">
             dokqet
          </span>
        </div>

        <div class="w-full max-w-sm animate-fade-in-up" style="animation-delay: 100ms;">
          
          <div class="text-center md:text-left mb-10">
             <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Crear Cuenta</h1>
             <p class="text-slate-500 mt-2 text-base">Comienza tus 14 días de prueba gratis</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
            
            <!-- Full Name Field -->
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700">Nombre Completo</label>
              <div class="relative group">
                 <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <app-icon name="user" class="text-slate-400 group-focus-within:text-blue-500 transition-colors" [size]="18"></app-icon>
                 </div>
                 <input 
                   type="text" 
                   formControlName="name"
                   class="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
                   placeholder="Juan Pérez"
                 >
              </div>
            </div>

            <!-- Email Field -->
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700">Correo Electrónico</label>
              <div class="relative group">
                 <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <app-icon name="user" class="text-slate-400 group-focus-within:text-blue-500 transition-colors" [size]="18"></app-icon>
                 </div>
                 <input 
                   type="email" 
                   formControlName="email"
                   class="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
                   placeholder="tu@email.com"
                 >
              </div>
            </div>

            <!-- Password Field -->
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700">Contraseña</label>
              <div class="relative group">
                 <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <app-icon name="lock" class="text-slate-400 group-focus-within:text-blue-500 transition-colors" [size]="18"></app-icon>
                 </div>
                 <input 
                   type="password" 
                   formControlName="password"
                   class="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
                   placeholder="••••••••"
                 >
              </div>
              <p class="text-xs text-slate-500 mt-1 ml-1">Mínimo 6 caracteres.</p>
            </div>

            <button 
              type="submit" 
              [disabled]="registerForm.invalid || isLoading()"
              class="relative w-full py-4 text-white rounded-2xl font-bold shadow-xl shadow-blue-600/30 overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0 active:shadow-blue-600/20 mt-8"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transition-opacity duration-300"></div>
              <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="relative flex items-center justify-center gap-3">
                 @if (isLoading()) {
                   <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   <span>Creando cuenta...</span>
                 } @else {
                   <span>Empezar mi Prueba</span>
                   <app-icon name="chevron-right" [size]="18" class="group-hover:translate-x-1 transition-transform"></app-icon>
                 }
              </div>
            </button>

          </form>

          <p class="text-center mt-10 text-slate-500 text-sm font-medium">
            ¿Ya tienes una cuenta? 
            <a routerLink="/login" class="text-blue-600 font-bold hover:text-blue-800 transition-colors hover:underline underline-offset-4 decoration-2">Inicia Sesión</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      setTimeout(() => {
        const { name, email } = this.registerForm.value;
        this.authService.register(name!, email!);
        this.router.navigate(['/dashboard']);
        this.isLoading.set(false);
      }, 1000);
    }
  }
}