import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login.component';
import { RegisterComponent } from './pages/register.component';
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

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'confirm-email', component: EmailConfirmationComponent },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
        data: { breadcrumb: 'Panel General' }
    },
    {
        path: 'users',
        component: UsersComponent,
        canActivate: [authGuard],
        data: { breadcrumb: 'Gestión de Usuarios' }
    },
    {
        path: 'cases',
        component: CasesComponent,
        canActivate: [authGuard],
        data: { breadcrumb: 'Expedientes' }
    },
    {
        path: 'activities',
        component: ActivitiesComponent,
        canActivate: [authGuard],
        data: { breadcrumb: 'Historial de Actividad' }
    },
    {
        path: 'clients',
        component: ClientsComponent,
        canActivate: [authGuard],
        data: { breadcrumb: 'Clientes' }
    },
    {
        path: 'clients/new',  // New Route
        component: ClientCreateComponent,
        canActivate: [authGuard],
        data: { breadcrumb: 'Nuevo Cliente' }
    },
    {
        path: 'calendar',
        component: PlaceholderComponent,
        canActivate: [authGuard],
        data: { breadcrumb: 'Agenda Judicial' }
    },
    {
        path: 'documents',
        component: PlaceholderComponent,
        canActivate: [authGuard],
        data: { breadcrumb: 'Documentos' }
    },
    {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [authGuard],
        data: { breadcrumb: 'Configuración' }
    },
    {
        path: 'judiciales/mis-procesos',
        component: MyProcessesComponent,
        canActivate: [authGuard],
        data: { breadcrumb: 'Mis Procesos Judiciales' }
    },
    {
        path: 'judiciales/mis-procesos/:id',
        component: ProcessDetailComponent,
        canActivate: [authGuard],
        data: { breadcrumb: 'Detalle del Proceso Judicial' }
    },
    { path: '**', redirectTo: 'dashboard' }
];
