import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
  ],
  providers: [
    // Lazy load charts provider only for admin section
    provideCharts(withDefaultRegisterables()),
  ],
  template: `
    <mat-sidenav-container class="h-screen">
      <mat-sidenav mode="side" opened class="w-64 border-r bg-white">
        <div class="p-6 border-b flex items-center gap-2">
          <mat-icon class="text-primary">admin_panel_settings</mat-icon>
          <span class="font-bold text-lg">Admin Panel</span>
        </div>

        <mat-nav-list class="pt-4">
          <a
            mat-list-item
            routerLink="/admin/dashboard"
            routerLinkActive="bg-gray-100 text-primary"
            class="mb-1"
          >
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a
            mat-list-item
            routerLink="/admin/products"
            routerLinkActive="bg-gray-100 text-primary"
            class="mb-1"
          >
            <mat-icon matListItemIcon>inventory_2</mat-icon>
            <span matListItemTitle>Products</span>
          </a>
          <a
            mat-list-item
            routerLink="/admin/orders"
            routerLinkActive="bg-gray-100 text-primary"
            class="mb-1"
          >
            <mat-icon matListItemIcon>shopping_bag</mat-icon>
            <span matListItemTitle>Orders</span>
          </a>
          <a mat-list-item routerLink="/" class="mt-4 border-t">
            <mat-icon matListItemIcon>home</mat-icon>
            <span matListItemTitle>Back to Store</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content class="bg-gray-50 flex flex-col">
        <mat-toolbar class="bg-white   shadow-sm px-6">
          <span class="flex-1"></span>
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium">Administrator</span>
            <div
              class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"
            >
              <mat-icon class="text-sm">person</mat-icon>
            </div>
          </div>
        </mat-toolbar>

        <div class="p-6 flex-1 overflow-auto">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
      }
    `,
  ],
})
export class AdminLayoutComponent {}
