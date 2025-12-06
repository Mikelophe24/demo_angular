import { Component, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatBadge } from '@angular/material/badge';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { EcommerceStore } from '../../ecommerce';
import { MatDivider } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { AuthDialogComponent } from '../../components/auth-dialog/auth-dialog.component';

@Component({
  selector: 'app-header-actions',
  imports: [
    MatButton,
    MatIconButton,
    MatIcon,
    RouterLink,
    MatBadge,
    MatMenu,
    MatMenuTrigger,
    MatDivider,
  ],
  template: `
    <div class="flex items-center gap-2">
      <button
        matIconButton
        routerLink="/wishlist"
        [matBadge]="store.wishlistCount()"
        [matBadgeHidden]="store.wishlistCount() === 0"
      >
        <mat-icon>favorite</mat-icon>
      </button>
      <button
        matIconButton
        [matBadge]="store.cartCount()"
        [matBadgeHidden]="store.cartCount() === 0"
        routerLink="cart"
      >
        <mat-icon>shopping_cart</mat-icon>
      </button>

      @if(authService.currentUser; as user) {
      <button matIconButton [matMenuTriggerFor]="userMenu">
        <img
          [src]="user.imageUrl || 'https://i.pravatar.cc/150?u=' + user.email"
          [alt]="user.name"
          class="w-8 h-8 rounded-full object-cover"
        />
      </button>

      <mat-menu #userMenu="matMenu" xPosition="before">
        <div class="flex flex-col px-4 py-3 min-w-[220px] border-b">
          <span class="text-sm font-semibold text-gray-800">{{ user.name }}</span>
          <span class="text-xs text-gray-500">{{ user.email }}</span>
          <span class="text-xs mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full w-fit">
            {{ user.role === 'admin' ? '👑 Admin' : '👤 Customer' }}
          </span>
        </div>

        @if(user.role === 'admin') {
        <button mat-menu-item routerLink="/admin" class="flex items-center gap-3">
          <mat-icon class="text-purple-600">admin_panel_settings</mat-icon>
          <span>Admin Panel</span>
        </button>
        }

        <button mat-menu-item class="flex items-center gap-3">
          <mat-icon>person</mat-icon>
          <span>My Profile</span>
        </button>

        <button mat-menu-item routerLink="/my-orders" class="flex items-center gap-3">
          <mat-icon>shopping_bag</mat-icon>
          <span>My Orders</span>
        </button>

        <mat-divider></mat-divider>

        <button mat-menu-item (click)="logout()" class="flex items-center gap-3 text-red-600">
          <mat-icon>logout</mat-icon>
          <span>Sign Out</span>
        </button>
      </mat-menu>
      } @else {
      <button mat-button (click)="openAuthDialog()">
        <mat-icon class="mr-1">login</mat-icon>
        Sign In
      </button>
      }
    </div>
  `,
  styles: [
    `
      ::ng-deep .mat-mdc-menu-content {
        padding: 0 !important;
      }
    `,
  ],
})
export class HeaderActions {
  store = inject(EcommerceStore);
  authService = inject(AuthService);
  matDialog = inject(MatDialog);

  openAuthDialog() {
    this.matDialog.open(AuthDialogComponent, {
      width: '500px',
      disableClose: false,
    });
  }

  logout() {
    this.authService.logout();
  }
}
