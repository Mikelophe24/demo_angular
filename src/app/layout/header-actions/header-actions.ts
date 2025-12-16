import { Component, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatBadge } from '@angular/material/badge';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { EcommerceStore } from '../../ecommerce';
import { MatDivider } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { SignInDialogComponent } from '../../components/sign-in-dialog/sign-in-dialog.component';
import { SignUpDialogComponent } from '../../components/sign-up-dialog/sign-up-dialog.component';
import { HasRoleDirective } from '../../directives/has-role.directive';
import { UserRole } from '../../models/user';


@Component({
  selector: 'app-header-actions',
  standalone: true,
  imports: [
    MatButton,
    MatIconButton,
    MatIcon,
    RouterLink,
    MatBadge,
    MatMenu,
    MatMenuTrigger,
    MatDivider,
    HasRoleDirective,
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
      @if(store.user(); as user){
      <button matIconButton [matMenuTriggerFor]="userMenu">
        <img [src]="user.imageUrl" [alt]="user.name" class="w-8 h-8 rounded-full" />
      </button>

      <mat-menu #userMenu="matMenu" xPosition="before">
        <div class="flex flex-col px-3 min-w-[200px] py-2">
          <span class="text-sm font-medium">{{ user.name }}</span>
          <span class="text-xs text-gray-500">{{ user.email }}</span>
          <span class="text-xs text-purple-600 font-semibold mt-1">{{ user.role }}</span>
        </div>
        <mat-divider class="mx-3"></mat-divider>

        <!-- Admin Dashboard Link - Chỉ hiển thị cho Admin -->
        <div *hasRole="UserRole.ADMIN">
          <button
            mat-menu-item
            routerLink="/admin"
            class="h-8 min-h-0 flex items-center gap-3 px-4 py-1 !m-0"
          >
            <mat-icon class="w-5 h-5 text-base shrink-0">admin_panel_settings</mat-icon>
            <span  class="text-gray-800 font-medium cursor-pointer hover:text-blue-600 transition-colors">Admin Dashboard</span>
          </button>
          <mat-divider class="mx-3"></mat-divider>
        </div>

        <!-- Sign out -->
        <button
          mat-menu-item
          (click)="store.signOut()"
          class="h-8 min-h-0 flex items-center gap-3 px-4 py-1 !m-0"
        >
          <mat-icon class="w-5 h-5 text-base shrink-0">logout</mat-icon>
          <span  class="text-gray-800 font-medium cursor-pointer hover:text-blue-600 transition-colors">Sign out</span>
        </button>
      </mat-menu>
      }@else {
      <button matButton (click)="openSignInDialog()">Sign In</button>
      <button matButton="filled" (click)="openSignUpDialog()">Sign Up</button>
      }
    </div>
  `,
  styles: ``,
})
export class HeaderActions {
  store = inject(EcommerceStore);
  matDialog = inject(MatDialog);
  
  // Expose UserRole enum để template có thể sử dụng
  UserRole = UserRole;

  openSignInDialog() {
    this.matDialog.open(SignInDialogComponent, {
      disableClose: true,
    });
  }
  openSignUpDialog() {
    this.matDialog.open(SignUpDialogComponent, {
      disableClose: true,
    });
  }
}
