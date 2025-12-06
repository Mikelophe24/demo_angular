import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { ToasterService } from '../../services/toaster.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
  ],
  template: `
    <div class="auth-dialog">
      <h2 mat-dialog-title class="text-center text-2xl font-bold mb-4">Welcome to Modern Store</h2>

      <mat-dialog-content>
        <mat-tab-group animationDuration="300ms" class="auth-tabs">
          <!-- Login Tab -->
          <mat-tab label="Login">
            <div class="tab-content">
              <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Email</mat-label>
                  <input
                    matInput
                    type="email"
                    formControlName="email"
                    placeholder="admin@example.com"
                  />
                  <mat-icon matPrefix>email</mat-icon>
                  @if (loginForm.get('email')?.hasError('required') &&
                  loginForm.get('email')?.touched) {
                  <mat-error>Email is required</mat-error>
                  } @if (loginForm.get('email')?.hasError('email')) {
                  <mat-error>Invalid email format</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Password</mat-label>
                  <input
                    matInput
                    [type]="hideLoginPassword ? 'password' : 'text'"
                    formControlName="password"
                    placeholder="Enter your password"
                  />
                  <mat-icon matPrefix>lock</mat-icon>
                  <button
                    mat-icon-button
                    matSuffix
                    type="button"
                    (click)="hideLoginPassword = !hideLoginPassword"
                  >
                    <mat-icon>{{ hideLoginPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                  </button>
                  @if (loginForm.get('password')?.hasError('required') &&
                  loginForm.get('password')?.touched) {
                  <mat-error>Password is required</mat-error>
                  }
                </mat-form-field>

                <div class="demo-credentials">
                  <p class="text-sm text-gray-600 mb-2">Demo Accounts:</p>
                  <div class="flex gap-2 flex-wrap">
                    <button
                      type="button"
                      mat-stroked-button
                      class="text-xs"
                      (click)="fillAdminCredentials()"
                    >
                      Use Admin
                    </button>
                  </div>
                </div>

                @if (loginError) {
                <div class="error-message">
                  <mat-icon>error</mat-icon>
                  {{ loginError }}
                </div>
                }

                <button
                  mat-raised-button
                  color="primary"
                  type="submit"
                  class="w-full"
                  [disabled]="loginForm.invalid || isLoading"
                >
                  @if (isLoading) {
                  <span>Logging in...</span>
                  } @else {
                  <span>Login</span>
                  }
                </button>
              </form>
            </div>
          </mat-tab>

          <!-- Register Tab -->
          <mat-tab label="Register">
            <div class="tab-content">
              <form [formGroup]="registerForm" (ngSubmit)="onRegister()">
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Full Name</mat-label>
                  <input matInput formControlName="name" placeholder="John Doe" />
                  <mat-icon matPrefix>person</mat-icon>
                  @if (registerForm.get('name')?.hasError('required') &&
                  registerForm.get('name')?.touched) {
                  <mat-error>Name is required</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Email</mat-label>
                  <input
                    matInput
                    type="email"
                    formControlName="email"
                    placeholder="you@example.com"
                  />
                  <mat-icon matPrefix>email</mat-icon>
                  @if (registerForm.get('email')?.hasError('required') &&
                  registerForm.get('email')?.touched) {
                  <mat-error>Email is required</mat-error>
                  } @if (registerForm.get('email')?.hasError('email')) {
                  <mat-error>Invalid email format</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Password</mat-label>
                  <input
                    matInput
                    [type]="hideRegisterPassword ? 'password' : 'text'"
                    formControlName="password"
                    placeholder="Minimum 6 characters"
                  />
                  <mat-icon matPrefix>lock</mat-icon>
                  <button
                    mat-icon-button
                    matSuffix
                    type="button"
                    (click)="hideRegisterPassword = !hideRegisterPassword"
                  >
                    <mat-icon>{{
                      hideRegisterPassword ? 'visibility_off' : 'visibility'
                    }}</mat-icon>
                  </button>
                  @if (registerForm.get('password')?.hasError('required') &&
                  registerForm.get('password')?.touched) {
                  <mat-error>Password is required</mat-error>
                  } @if (registerForm.get('password')?.hasError('minlength')) {
                  <mat-error>Password must be at least 6 characters</mat-error>
                  }
                </mat-form-field>

                @if (registerError) {
                <div class="error-message">
                  <mat-icon>error</mat-icon>
                  {{ registerError }}
                </div>
                }

                <button
                  mat-raised-button
                  color="primary"
                  type="submit"
                  class="w-full"
                  [disabled]="registerForm.invalid || isLoading"
                >
                  @if (isLoading) {
                  <span>Creating account...</span>
                  } @else {
                  <span>Create Account</span>
                  }
                </button>
              </form>
            </div>
          </mat-tab>
        </mat-tab-group>
      </mat-dialog-content>
    </div>
  `,
  styles: [
    `
      .auth-dialog {
        min-width: 400px;
        max-width: 500px;
      }

      .tab-content {
        padding: 24px 0;
      }

      mat-form-field {
        margin-bottom: 16px;
      }

      .demo-credentials {
        margin-bottom: 16px;
        padding: 12px;
        background: #f5f5f5;
        border-radius: 8px;
      }

      .error-message {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px;
        margin-bottom: 16px;
        background: #ffebee;
        color: #c62828;
        border-radius: 4px;
        font-size: 14px;
      }

      .error-message mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      ::ng-deep .auth-tabs .mat-mdc-tab-labels {
        justify-content: center;
      }
    `,
  ],
})
export class AuthDialogComponent {
  private authService = inject(AuthService);
  private toaster = inject(ToasterService);
  private dialogRef = inject(MatDialogRef<AuthDialogComponent>);
  private router = inject(Router);

  hideLoginPassword = true;
  hideRegisterPassword = true;
  isLoading = false;
  loginError = '';
  registerError = '';

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  fillAdminCredentials() {
    this.loginForm.patchValue({
      email: 'admin@example.com',
      password: 'admin123',
    });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.loginError = '';

    const credentials = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!,
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.toaster.success(`Welcome back, ${response.user.name}!`);

        // Small delay to ensure state updates propagate
        setTimeout(() => {
          this.dialogRef.close(response.user);

          // Redirect admin to admin panel
          if (response.user.role === 'admin') {
            this.router.navigate(['/admin']);
          }
        }, 100);
      },
      error: (error) => {
        this.isLoading = false;
        this.loginError = error.error?.message || 'Invalid email or password';
        this.toaster.error(this.loginError);
      },
    });
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.registerError = '';

    const data = {
      name: this.registerForm.value.name!,
      email: this.registerForm.value.email!,
      password: this.registerForm.value.password!,
    };

    this.authService.register(data).subscribe({
      next: () => {
        this.isLoading = false;
        this.toaster.success('Account created! Please login.');

        // Auto switch to login tab and fill email
        this.loginForm.patchValue({ email: data.email });
      },
      error: (error) => {
        this.isLoading = false;
        this.registerError = error.error?.message || 'Failed to create account';
        this.toaster.error(this.registerError);
      },
    });
  }
}
