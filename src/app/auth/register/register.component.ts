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
      if (params['planType']) {
        const validPlans = ['individual', 'individual-profesional', 'empresarial'];
        if (validPlans.includes(params['planType'].toLowerCase())) {
          this.registerForm.patchValue({ planType: params['planType'].toLowerCase() });
        }
      }
    });

    // Dynamically update validators for tenantName based on plan
    this.registerForm.get('planType')?.valueChanges.subscribe(planValue => {
      const tenantControl = this.registerForm.get('companyName');
      if (planValue === 'individual-profesional' || planValue === 'empresarial') {
        tenantControl?.setValidators([Validators.required, Validators.minLength(3)]);
      } else {
        // Individual plan doesn't require manual tenant name; we auto-build it later
        tenantControl?.clearValidators();
      }
      tenantControl?.updateValueAndValidity();
    });
  }

  registerForm = this.fb.group({
    planType: ['individual', [Validators.required]],
    companyName: [''],
    documentTypeId: [null as number | null, [Validators.required]],
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
    // Parse value to number since ID must be a Long (number in TS)
    const numValue = parseInt(value, 10);
    this.registerForm.patchValue({ documentTypeId: isNaN(numValue) ? null : numValue });
    const control = this.registerForm.get('documentTypeId');
    if (control) {
      control.markAsTouched();
      control.markAsDirty();
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);

      const formValue = this.registerForm.value;
      let generatedTenantName = formValue.companyName || '';

      // Auto-generate tenantName for individual plans (First Name + Second Last Name/Last Name)
      if (formValue.planType === 'individual') {
        const firstN = formValue.firstName?.trim() || '';
        // Using secondLastName if present, otherwise fallback to lastName to ensure a reasonable name
        const lastN = (formValue.secondLastName?.trim() || formValue.lastName?.trim() || '');
        generatedTenantName = `${firstN} ${lastN}`.trim();
      }

      // Map UI plan selection to backend expected ENUMS
      let backendPlan: 'INDIVIDUAL' | 'ENTERPRISE' = 'INDIVIDUAL';
      if (formValue.planType === 'empresarial') {
        backendPlan = 'ENTERPRISE';
      }

      const userPayload: RegisteredUser = {
        companyName: generatedTenantName,
        planType: backendPlan,
        documentTypeId: Number(formValue.documentTypeId),
        documentNumber: formValue.documentNumber || '',
        firstName: formValue.firstName || '',
        middleName: formValue.middleName || undefined,
        lastName: formValue.lastName || '',
        secondLastName: formValue.secondLastName || undefined,
        email: formValue.email || '',
        password: formValue.password || ''
      };

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