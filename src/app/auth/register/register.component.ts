import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { IconComponent } from '../../components/ui/icons.component';
import { SearchableSelectComponent, SelectOption } from '../../components/ui/searchable-select.component';
import { CommonsService } from '../../services/commons.service';
import { AuthService } from '../../services/auth.service';
import { DocumentType } from '../../models/document-type.model';
import { RegisteredUser } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, IconComponent, SearchableSelectComponent],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private commonsService = inject(CommonsService);
  private fb: FormBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = signal(false);
  isLoadingDocs = signal(true);

  // Opciones de tipo de documento cargadas desde el servicio
  documentTypes = signal<DocumentType[]>([]);

  documentTypeOptions = computed<SelectOption[]>(() => {
    return this.documentTypes().map(dt => ({ value: dt.id, label: dt.name }));
  });

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

    // Check URL parameters for pre-selected plan
    this.route.queryParams.subscribe(params => {
      if (params['plan']) {
        const validPlans = ['individual', 'individual-profesional', 'empresarial'];
        if (validPlans.includes(params['plan'].toLowerCase())) {
          this.registerForm.patchValue({ planType: params['plan'].toLowerCase() });
        }
      }
    });

    // Dynamically update validators for companyName based on planType
    this.registerForm.get('planType')?.valueChanges.subscribe(plan => {
      const companyControl = this.registerForm.get('companyName');
      if (plan === 'individual-profesional' || plan === 'empresarial') {
        companyControl?.setValidators([Validators.required, Validators.minLength(3)]);
      } else {
        companyControl?.clearValidators();
      }
      companyControl?.updateValueAndValidity();
    });
  }

  registerForm = this.fb.group({
    planType: ['individual', [Validators.required]],
    companyName: [''],
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

  onDocumentTypeChange(value: string) {
    this.registerForm.patchValue({ documentType: value });
    const control = this.registerForm.get('documentType');
    if (control) {
      control.markAsTouched();
      control.markAsDirty();
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      const userPayload: RegisteredUser = this.registerForm.value as RegisteredUser;

      this.authService.register(userPayload).subscribe({
        next: (response: any) => {
          this.router.navigate(['/login']);
          this.isLoading.set(false);
        },
        error: (error: any) => {
          console.error('Error durante el registro:', error);
          this.isLoading.set(false);
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}