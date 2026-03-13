import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { IconComponent } from '../components/ui/icons.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-client-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, IconComponent],
  template: `
    <div class="animate-fade-in pb-12">
      
      <!-- Top Bar / Navigation -->
      <div class="flex items-center gap-4 mb-8">
        <a routerLink="/clients" class="p-2 rounded-xl bg-white dark:bg-slate-800 transition-colors duration-300 border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-sm">
          <app-icon name="chevron-right" class="rotate-180" [size]="20"></app-icon>
        </a>
        <div>
          <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">Registrar Nuevo Cliente</h1>
          <p class="text-slate-500">Complete la información para abrir un nuevo expediente.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <!-- Left: Form Section -->
        <div class="lg:col-span-2 space-y-6">
          <form [formGroup]="clientForm" (ngSubmit)="onSubmit()" class="bg-white dark:bg-slate-800 transition-colors duration-300 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-300 p-8">
            
            <h3 class="font-bold text-lg text-slate-800 dark:text-slate-200 transition-colors duration-300 mb-6 flex items-center gap-2">
              <span class="w-1 h-6 bg-indigo-500 rounded-full"></span>
              Información General
            </h3>

            <div class="space-y-8"> <!-- Spacing between fields -->
              
              <!-- Name & Company Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                
                <!-- Name Field -->
                <div class="relative group">
                  <label class="block text-sm font-semibold text-slate-700 mb-2">Nombre Completo <span class="text-rose-500">*</span></label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                      <app-icon name="users" [size]="18"></app-icon>
                    </span>
                    <input 
                      type="text" 
                      formControlName="name"
                      class="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white dark:bg-slate-800 transition-colors duration-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400"
                      [class.border-rose-300]="hasError('name')"
                      [class.focus:border-rose-500]="hasError('name')"
                      placeholder="Ej. Roberto Gómez"
                    >
                  </div>
                  <!-- Absolute positioned error message to prevent layout shift -->
                  @if (hasError('name')) {
                    <p class="absolute -bottom-6 left-1 text-xs font-bold text-rose-500 flex items-center gap-1 animate-fade-in-up">
                       <span class="w-1 h-1 rounded-full bg-rose-500"></span>
                       El nombre es obligatorio (min 3 caracteres)
                    </p>
                  }
                </div>

                <!-- Company Field -->
                <div class="relative group">
                  <label class="block text-sm font-semibold text-slate-700 mb-2">Empresa / Organización</label>
                  <div class="relative">
                     <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                      <app-icon name="briefcase" [size]="18"></app-icon>
                    </span>
                    <input 
                      type="text" 
                      formControlName="company"
                      class="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white dark:bg-slate-800 transition-colors duration-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400"
                      placeholder="Ej. TechCorp (Opcional)"
                    >
                  </div>
                </div>

              </div>

              <h3 class="font-bold text-lg text-slate-800 dark:text-slate-200 transition-colors duration-300 pt-2 mb-6 flex items-center gap-2">
                <span class="w-1 h-6 bg-emerald-500 rounded-full"></span>
                Datos de Contacto
              </h3>

              <!-- Contact Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                
                <!-- Email Field -->
                <div class="relative group">
                  <label class="block text-sm font-semibold text-slate-700 mb-2">Correo Electrónico <span class="text-rose-500">*</span></label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                      <div class="w-4 h-4 rounded-full border-2 border-current"></div>
                    </span>
                    <input 
                      type="email" 
                      formControlName="email"
                      class="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white dark:bg-slate-800 transition-colors duration-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400"
                      [class.border-rose-300]="hasError('email')"
                      placeholder="cliente@email.com"
                    >
                  </div>
                  @if (hasError('email')) {
                    <p class="absolute -bottom-6 left-1 text-xs font-bold text-rose-500 flex items-center gap-1 animate-fade-in-up">
                       <span class="w-1 h-1 rounded-full bg-rose-500"></span>
                       Ingrese un correo válido
                    </p>
                  }
                </div>

                <!-- Phone Field -->
                <div class="relative group">
                  <label class="block text-sm font-semibold text-slate-700 mb-2">Teléfono Móvil <span class="text-rose-500">*</span></label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                      <app-icon name="bell" [size]="18"></app-icon>
                    </span>
                    <input 
                      type="tel" 
                      formControlName="phone"
                      class="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white dark:bg-slate-800 transition-colors duration-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400"
                      [class.border-rose-300]="hasError('phone')"
                      placeholder="+52 55 0000 0000"
                    >
                  </div>
                   @if (hasError('phone')) {
                    <p class="absolute -bottom-6 left-1 text-xs font-bold text-rose-500 flex items-center gap-1 animate-fade-in-up">
                       <span class="w-1 h-1 rounded-full bg-rose-500"></span>
                       Teléfono obligatorio (min 10 dígitos)
                    </p>
                  }
                </div>

              </div>

              <!-- Status Field -->
              <div class="relative group pt-2">
                <label class="block text-sm font-semibold text-slate-700 mb-2">Estado Inicial de la Cuenta</label>
                <div class="relative">
                  <select formControlName="status" class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white dark:bg-slate-800 transition-colors duration-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all appearance-none cursor-pointer text-slate-700 font-medium">
                    <option value="Activo">Activo - Cliente con procesos vigentes</option>
                    <option value="Potencial">Potencial - En etapa de negociación</option>
                    <option value="Inactivo">Inactivo - Sin procesos actuales</option>
                  </select>
                  <app-icon name="chevron-down" [size]="16" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></app-icon>
                </div>
              </div>

            </div> <!-- End space-y-8 -->

            <div class="mt-10 pt-6 border-t border-slate-100 dark:border-slate-700 transition-colors duration-300 flex justify-end gap-3">
               <a routerLink="/clients" class="px-6 py-3 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all">
                Cancelar
              </a>
              <button 
                type="submit"
                [disabled]="clientForm.invalid || isLoading()"
                class="px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
              >
                @if (isLoading()) {
                  <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                }
                Guardar Expediente
              </button>
            </div>
          </form>
        </div>

        <!-- Right: Real-time Preview Card -->
        <div class="lg:col-span-1">
          <div class="sticky top-24 space-y-6">
             <div class="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-xs font-bold mb-2">
                <app-icon name="check-circle" [size]="14"></app-icon> Vista Previa
             </div>

             <!-- The Card -->
             <div class="bg-white dark:bg-slate-800 transition-colors duration-300 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 dark:border-slate-700 transition-colors duration-300 transition-all duration-500 transform hover:scale-[1.02]">
                <!-- Card Header / Cover -->
                <div class="h-24 bg-gradient-to-r from-indigo-600 to-purple-600 relative overflow-hidden">
                   <div class="absolute inset-0 bg-white dark:bg-slate-800 transition-colors duration-300/10" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 20px 20px; opacity: 0.2"></div>
                   <div class="absolute -bottom-10 -right-10 w-32 h-32 bg-white dark:bg-slate-800 transition-colors duration-300/10 rounded-full blur-2xl"></div>
                </div>

                <!-- Card Content -->
                <div class="px-6 pb-8 relative">
                   <!-- Avatar -->
                   <div class="w-20 h-20 bg-white dark:bg-slate-800 transition-colors duration-300 p-1 rounded-full shadow-md -mt-10 mb-4 mx-auto relative z-10">
                      <img 
                        [src]="'https://ui-avatars.com/api/?name=' + (formValues().name || 'Nuevo Cliente') + '&background=6366f1&color=fff'" 
                        class="w-full h-full rounded-full object-cover bg-slate-100"
                      >
                   </div>

                   <!-- Info -->
                   <div class="text-center space-y-1 mb-6">
                      <h2 class="text-xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300 break-words leading-tight">
                        {{ formValues().name || 'Nombre del Cliente' }}
                      </h2>
                      <p class="text-sm font-medium text-slate-500">
                        {{ formValues().company || 'Empresa / Particular' }}
                      </p>
                      
                      <div class="pt-2 flex justify-center">
                        <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors duration-300"
                          [class.bg-emerald-50]="formValues().status === 'Activo'"
                          [class.text-emerald-700]="formValues().status === 'Activo'"
                          [class.border-emerald-200]="formValues().status === 'Activo'"
                          [class.bg-blue-50]="formValues().status === 'Potencial'"
                          [class.text-blue-700]="formValues().status === 'Potencial'"
                          [class.border-blue-200]="formValues().status === 'Potencial'"
                          [class.bg-slate-50]="formValues().status === 'Inactivo'"
                          [class.text-slate-500]="formValues().status === 'Inactivo'"
                          [class.border-slate-200]="formValues().status === 'Inactivo'"
                        >
                          {{ formValues().status || 'Activo' }}
                        </span>
                      </div>
                   </div>

                   <!-- Contact Details in Card -->
                   <div class="space-y-3 pt-4 border-t border-slate-50">
                      <div class="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700 transition-colors duration-300/50">
                         <div class="p-1.5 bg-white dark:bg-slate-800 transition-colors duration-300 rounded-lg text-indigo-500 shadow-sm">
                           <!-- Simple Mail Icon -->
                           <div class="w-3 h-3 border border-current rounded-sm"></div>
                         </div>
                         <span class="truncate">{{ formValues().email || 'correo@ejemplo.com' }}</span>
                      </div>
                      <div class="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700 transition-colors duration-300/50">
                         <div class="p-1.5 bg-white dark:bg-slate-800 transition-colors duration-300 rounded-lg text-indigo-500 shadow-sm">
                            <app-icon name="bell" [size]="12"></app-icon>
                         </div>
                         <span class="truncate">{{ formValues().phone || '+00 000 000 0000' }}</span>
                      </div>
                   </div>

                   <!-- Card Footer -->
                   <div class="mt-6 text-center">
                      <p class="text-[10px] text-slate-400 font-medium">dokqet System</p>
                   </div>
                </div>
             </div>

             <div class="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-3">
                <app-icon name="check-circle" class="text-indigo-600 mt-0.5" [size]="20"></app-icon>
                <div>
                   <h4 class="text-sm font-bold text-indigo-900">Listo para registrar</h4>
                   <p class="text-xs text-indigo-700 mt-1">Al guardar, se generará automáticamente el expediente número <span class="font-mono font-bold">EXP-2024-{{ randomId }}</span>.</p>
                </div>
             </div>

          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.6s ease-out; }
    .animate-fade-in-up { animation: fadeInUp 0.3s ease-out; }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ClientCreateComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  isLoading = signal(false);
  randomId = Math.floor(Math.random() * 900) + 100;

  clientForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    company: [''],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(10)]],
    status: ['Activo']
  });

  // Signal to reactively update preview
  formValues = toSignal(this.clientForm.valueChanges, {
    initialValue: {
      name: '', company: '', email: '', phone: '', status: 'Activo'
    }
  });

  hasError(field: string): boolean {
    const control = this.clientForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.clientForm.valid) {
      this.isLoading.set(true);
      // Simulate API call
      setTimeout(() => {
        this.isLoading.set(false);
        this.router.navigate(['/clients']);
      }, 1500);
    } else {
      this.clientForm.markAllAsTouched();
    }
  }
}