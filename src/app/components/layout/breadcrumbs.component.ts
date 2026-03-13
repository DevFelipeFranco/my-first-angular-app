import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { IconComponent } from '../ui/icons.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <nav class="flex items-center text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <a routerLink="/dashboard" class="inline-flex items-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors duration-300">
            <app-icon name="home" [size]="16" class="mr-2"></app-icon>
            dokqet
          </a>
        </li>
        @for (crumb of breadcrumbs(); track crumb.path) {
          <li>
            <div class="flex items-center">
              <app-icon name="chevron-right" [size]="16" class="text-slate-400 mx-1"></app-icon>
              @if (crumb.isLast) {
                <span class="ml-1 font-medium text-slate-900 dark:text-slate-100 transition-colors duration-300 md:ml-2">{{ crumb.label }}</span>
              } @else {
                <a [routerLink]="crumb.path" class="ml-1 font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors duration-300 md:ml-2">{{ crumb.label }}</a>
              }
            </div>
          </li>
        }
      </ol>
    </nav>
  `
})
export class BreadcrumbsComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  breadcrumbs = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.createBreadcrumbs(this.activatedRoute.root))
    ),
    { initialValue: [] }
  );

  private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: any[] = []): any[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const label = child.snapshot.data['breadcrumb'];
      if (label) {
        breadcrumbs.push({
          label: label,
          path: url,
          isLast: false // We will fix last item later or relies on loop index
        });
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}