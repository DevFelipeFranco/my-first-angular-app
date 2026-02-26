import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { IconComponent } from '../components/ui/icons.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, IconComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div class="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        
        <div class="text-center mb-10">
          <div class="w-12 h-12 bg-indigo-600 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
            <span class="text-white font-bold text-xl">N</span>
          </div>
          <h1 class="text-2xl font-bold text-slate-800">Bienvenido de nuevo</h1>
          <p class="text-slate-500 mt-2">Ingresa a tu cuenta para continuar</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
          
          <!-- Custom Role Selector -->
          <div class="space-y-1 relative">
            <label class="text-sm font-medium text-slate-700 ml-1">Selecciona tu Perfil</label>
            
            <button 
              type="button"
              (click)="toggleDropdown()"
              (blur)="closeDropdownDelayed()"
              class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all flex items-center justify-between group"
              [class.ring-2]="dropdownOpen()"
              [class.ring-indigo-100]="dropdownOpen()"
              [class.border-indigo-500]="dropdownOpen()"
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                   <app-icon [name]="currentRole()?.icon || 'user'" [size]="18"></app-icon>
                </div>
                <div class="text-left">
                   <p class="text-sm font-bold text-slate-800 leading-tight">{{ currentRole()?.label }}</p>
                   <p class="text-[10px] text-slate-500 font-medium">{{ currentRole()?.desc }}</p>
                </div>
              </div>
              <app-icon name="chevron-down" [size]="18" class="text-slate-400 transition-transform duration-300" [class.rotate-180]="dropdownOpen()"></app-icon>
            </button>

            <!-- Dropdown Menu -->
            <div 
              class="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-20 transition-all duration-200 origin-top"
              [class.opacity-0]="!dropdownOpen()"
              [class.scale-95]="!dropdownOpen()"
              [class.pointer-events-none]="!dropdownOpen()"
              [class.opacity-100]="dropdownOpen()"
              [class.scale-100]="dropdownOpen()"
            >
              <div class="p-1">
                @for (role of roles; track role.id) {
                  <button 
                    type="button"
                    (click)="selectRole(role.id)"
                    class="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group text-left mb-1 last:mb-0"
                    [class.bg-indigo-50]="isSelected(role.id)"
                  >
                     <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                             [class]="isSelected(role.id) ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:shadow-sm'">
                           <app-icon [name]="role.icon" [size]="18"></app-icon>
                        </div>
                        <div>
                           <p class="text-sm font-bold leading-tight" [class]="isSelected(role.id) ? 'text-indigo-900' : 'text-slate-700'">{{ role.label }}</p>
                           <p class="text-[10px] font-medium" [class]="isSelected(role.id) ? 'text-indigo-600/80' : 'text-slate-400'">{{ role.desc }}</p>
                        </div>
                     </div>
                     @if (isSelected(role.id)) {
                        <app-icon name="check" [size]="16" class="text-indigo-600"></app-icon>
                     }
                  </button>
                }
              </div>
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-slate-700 ml-1">Email</label>
            <input 
              type="email" 
              formControlName="email"
              class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              placeholder="tu@email.com"
            >
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-slate-700 ml-1">Contraseña</label>
            <input 
              type="password" 
              formControlName="password"
              class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              placeholder="••••••••"
            >
          </div>

          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2 cursor-pointer text-slate-600">
              <input type="checkbox" class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
              Recordarme
            </label>
            <a href="#" class="text-indigo-600 font-medium hover:text-indigo-700">¿Olvidaste tu contraseña?</a>
          </div>

          <button 
            type="submit" 
            [disabled]="loginForm.invalid || isLoading()"
            class="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            @if (isLoading()) {
              <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            }
            <span>Iniciar Sesión</span>
          </button>

        </form>

        <p class="text-center mt-8 text-slate-500 text-sm">
          ¿No tienes una cuenta? 
          <a routerLink="/register" class="text-indigo-600 font-semibold hover:text-indigo-700">Regístrate</a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  dropdownOpen = signal(false);
  selectedRoleId = signal('admin');

  roles = [
    { id: 'admin', label: 'Socio Director', desc: 'Gestión administrativa y global', icon: 'shield' },
    { id: 'lawyer', label: 'Abogado Asociado', desc: 'Gestión de expedientes y agenda', icon: 'briefcase' }
  ];

  loginForm = this.fb.group({
    email: ['demo@nexus.com', [Validators.required, Validators.email]],
    password: ['password', [Validators.required, Validators.minLength(6)]],
    role: ['admin', [Validators.required]]
  });

  currentRole = computed(() => {
    const roleId = this.selectedRoleId();
    return this.roles.find(r => r.id === roleId);
  });

  toggleDropdown() {
    this.dropdownOpen.update(v => !v);
  }

  closeDropdownDelayed() {
    // Small delay to allow click event on options to fire before blur closes it
    setTimeout(() => {
      this.dropdownOpen.set(false);
    }, 200);
  }

  selectRole(roleId: string) {
    this.selectedRoleId.set(roleId);
    this.loginForm.controls.role.setValue(roleId);
    this.dropdownOpen.set(false);
  }

  isSelected(roleId: string): boolean {
    return this.selectedRoleId() === roleId;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);

      // Simulate API delay
      setTimeout(() => {
        const { email, role } = this.loginForm.value;
        // Mock name based on role for better demo
        const name = role === 'admin' ? 'Carlos Socio' : 'Ana Abogada';

        this.authService.login(email!, name, role as 'admin' | 'lawyer');
        this.router.navigate(['/dashboard']);
        this.isLoading.set(false);
      }, 800);
    }
  }
}