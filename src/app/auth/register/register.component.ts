import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IconComponent } from '../../components/ui/icons.component';
import { CommonsService, DocumentType } from '../../services/commons.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, IconComponent],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private commonsService = inject(CommonsService);
  private fb: FormBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  isLoadingDocs = signal(true);

  // Opciones de tipo de documento cargadas desde el servicio
  documentTypes = signal<DocumentType[]>([]);

  ngOnInit() {
    this.commonsService.getDocumentTypes().subscribe({
      next: (types) => {
        this.documentTypes.set(types);
        this.isLoadingDocs.set(false);
      },
      error: () => {
        this.isLoadingDocs.set(false);
      }
    });
  }

  registerForm = this.fb.group({
    documentType: ['', [Validators.required]],
    documentNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    middleName: [''],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    secondLastName: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  // Getter conveniente para fácil acceso a los controles del formulario en la plantilla
  get f() { return this.registerForm.controls; }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      const values = this.registerForm.value;
      const fullName = `${values.firstName} ${values.lastName}`.trim();

      this.authService.register(fullName, values.email!, values.password!).subscribe({
        next: (response) => {
          this.router.navigate(['/login']);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error durante el registro:', error);
          this.isLoading.set(false);
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}