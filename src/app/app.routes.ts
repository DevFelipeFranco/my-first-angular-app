import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { EmailConfirmationComponent } from './pages/email-confirmation.component';
import { DashboardComponent } from './pages/dashboard.component';
import { UsersComponent } from './pages/users.component';
import { CasesComponent } from './pages/cases.component';
import { ActivitiesComponent } from './pages/activities.component';
import { ClientsComponent } from './pages/clients.component';
import { SettingsComponent } from './pages/settings.component';
import { authGuard } from './auth/auth-guard';
import { PlaceholderComponent } from './components/placeholder.component';
import { ClientCreateComponent } from './pages/client-create.component';
import { LandingComponent } from './pages/landing.component';
import { MyProcessesComponent } from './pages/my-processes.component';
import { ProcessDetailComponent } from './pages/process-detail.component';
import { AppLayoutComponent } from './components/layout/app-layout.component';

export const routes: Routes = [
    // Public routes
    { path: '', component: LandingComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'confirm-email', component: EmailConfirmationComponent },

    // Protected routes wrapped in AppLayoutComponent
    {
        path: '',
        component: AppLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
                data: { breadcrumb: 'Panel General' }
            },
            {
                path: 'users',
                component: UsersComponent,
                data: { breadcrumb: 'Gestión de Usuarios' }
            },
            {
                path: 'cases',
                component: CasesComponent,
                data: { breadcrumb: 'Expedientes' }
            },
            {
                path: 'activities',
                component: ActivitiesComponent,
                data: { breadcrumb: 'Historial de Actividad' }
            },
            {
                path: 'clients',
                component: ClientsComponent,
                data: { breadcrumb: 'Clientes' }
            },
            {
                path: 'clients/new',
                component: ClientCreateComponent,
                data: { breadcrumb: 'Nuevo Cliente' }
            },
            {
                path: 'calendar',
                component: PlaceholderComponent,
                data: { breadcrumb: 'Agenda Judicial' }
            },
            {
                path: 'documents',
                component: PlaceholderComponent,
                data: { breadcrumb: 'Documentos' }
            },
            {
                path: 'settings',
                component: SettingsComponent,
                data: { breadcrumb: 'Configuración' }
            },
            {
                path: 'judiciales/mis-procesos',
                data: { breadcrumb: 'Mis Procesos' },
                children: [
                    {
                        path: '',
                        component: MyProcessesComponent
                    },
                    {
                        path: ':id',
                        component: ProcessDetailComponent,
                        data: { breadcrumb: 'Detalle del Proceso Judicial' }
                    }
                ]
            }
        ]
    },
    { path: '**', redirectTo: 'dashboard' }
];
