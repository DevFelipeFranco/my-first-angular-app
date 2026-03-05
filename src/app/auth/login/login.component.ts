import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IconComponent } from '../../components/ui/icons.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, IconComponent],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
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
    email: ['demo@dokqet.com', [Validators.required, Validators.email]],
    password: ['password', [Validators.required, Validators.minLength(6)]],
    role: ['admin', [Validators.required]]
  });

  ngOnInit() {
    if (this.authService.currentUser()) {
      this.router.navigate(['/dashboard']);
    }
  }

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