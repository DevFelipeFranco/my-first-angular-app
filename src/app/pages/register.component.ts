import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div class="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-slate-800">Crear Cuenta</h1>
          <p class="text-slate-500 mt-2">Únete a Nexus hoy mismo</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-5">
          
          <div class="space-y-1">
            <label class="text-sm font-medium text-slate-700 ml-1">Nombre Completo</label>
            <input 
              type="text" 
              formControlName="name"
              class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              placeholder="Juan Pérez"
            >
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

          <button 
            type="submit" 
            [disabled]="registerForm.invalid || isLoading()"
            class="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
             @if (isLoading()) {
              <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            }
            <span>Registrarse</span>
          </button>

        </form>

        <p class="text-center mt-8 text-slate-500 text-sm">
          ¿Ya tienes cuenta? 
          <a routerLink="/login" class="text-indigo-600 font-semibold hover:text-indigo-700">Inicia Sesión</a>
        </p>
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