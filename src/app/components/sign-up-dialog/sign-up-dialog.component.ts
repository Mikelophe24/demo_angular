import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatAnchor, MatButtonModule, MatIconButton } from '@angular/material/button';
  import { MAT_DIALOG_DATA, MatDialog, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
  import { MatFormFieldModule, MatPrefix, MatSuffix } from '@angular/material/form-field';
  import { MatIcon } from '@angular/material/icon';
  import { MatInputModule } from '@angular/material/input';
  import { EcommerceStore } from '../../ecommerce';
  import { SignUpParams } from '../../models/user';
  import { SignInDialogComponent } from '../sign-in-dialog/sign-in-dialog.component';

  // ✅ Custom Validator: Kiểm tra password matching
  function passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password');
      const confirmPassword = control.get('confirmPassword');

      // Nếu chưa có giá trị, không validate
      if (!password || !confirmPassword) {
        return null;
      }

      // Nếu confirmPassword chưa được touch, không validate
      if (!confirmPassword.value) {
        return null;
      }

      // So sánh passwords
      const isMatching = password.value === confirmPassword.value;

      // Set error trực tiếp vào confirmPassword field để dễ hiển thị
      if (!isMatching && confirmPassword.touched) {
        confirmPassword.setErrors({ ...confirmPassword.errors, passwordMismatch: true });
      } else if (isMatching && confirmPassword.hasError('passwordMismatch')) {
        // Xóa error passwordMismatch nếu passwords đã khớp
        const errors = { ...confirmPassword.errors };
        delete errors['passwordMismatch'];
        confirmPassword.setErrors(Object.keys(errors).length > 0 ? errors : null);
      }

      return isMatching ? null : { passwordMismatch: true };
    };
}

@Component({
  selector: 'app-sign-up-dialog',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    MatDialogClose,
    MatFormFieldModule,
    MatInputModule,
    // MatSuffix,
    // MatPrefix,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  template: `
    <div class="p-8 max-w-[400px] flex flex-col">
      <div class="flex justify-between">
        <div>
          <h2 class="text-xl font-medium mb-1">Sign Up</h2>
          <p class="text-sm text-gray-500">Join us and start shopping today</p>
        </div>
        <button tabindex="-1" matIconButton class="-mt-2 -mr-2" mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <div>
        <form [formGroup]="signupForm" class="mt-6 flex flex-col" (ngSubmit)="signUp()">
          <mat-form-field class="mb-4">
            <input formControlName="name" type="text" matInput placeholder="Enter your name" />
            <mat-icon matPrefix>person</mat-icon>
            @if (signupForm.get('name')?.invalid && signupForm.get('name')?.touched) {
            <mat-error>Name is required</mat-error>
            }
          </mat-form-field>

          <mat-form-field class="mb-4">
            <input formControlName="email" type="email" matInput placeholder="Enter your email" />
            <mat-icon matPrefix>email</mat-icon>
            @if (signupForm.get('email')?.invalid && signupForm.get('email')?.touched) {
            <mat-error>Please enter a valid email</mat-error>
            }
          </mat-form-field>

          <mat-form-field class="mb-4">
            <input
              formControlName="password"
              type="password"
              matInput
              placeholder="Enter your password"
            />
            <mat-icon matPrefix>lock</mat-icon>
            @if (signupForm.get('password')?.invalid && signupForm.get('password')?.touched) {
            <mat-error>Password must be at least 6 characters</mat-error>
            }
          </mat-form-field>

          <mat-form-field class="mb-4">
            <input
              formControlName="confirmPassword"
              type="password"
              matInput
              placeholder="Confirm your password"
            />
            <mat-icon matPrefix>lock</mat-icon>
            @if (signupForm.get('confirmPassword')?.hasError('required') &&
            signupForm.get('confirmPassword')?.touched) {
            <mat-error>Please confirm your password</mat-error>
            } @if (signupForm.get('confirmPassword')?.hasError('passwordMismatch') &&
            signupForm.get('confirmPassword')?.touched) {
            <mat-error>Passwords do not match</mat-error>
            }
          </mat-form-field>

          <button type="submit" matButton="filled" class="w-full">Create Account</button>
        </form>
        <p class="text-sm text-gray-500 mt-2 text-center">
          Already have an account?
          <a class="text-blue-500 cursor-pointer " (click)="openSignInDialog()">Sign In</a>
        </p>
      </div>
    </div>
  `,
  styles: ``,
})
export class SignUpDialogComponent {
  fb = inject(NonNullableFormBuilder);
  store = inject(EcommerceStore);
  dialogRef = inject(MatDialogRef);
  matDialog = inject(MatDialog);
  data = inject<{ checkout: boolean }>(MAT_DIALOG_DATA);

  // ✅ SỬA: Thêm this.fb.group()
  signupForm = this.fb.group({
    name: ['TriMinh', Validators.required],
    email: ['triminh@gmail.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['123456', Validators.required],
  });

  signUp() {
    if (!this.signupForm.valid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const { name, email, password } = this.signupForm.value;
    this.store.signUp({
      name,
      email,
      password,
      dialogId: this.dialogRef.id,
      checkout: this.data?.checkout,
    } as SignUpParams);
  }

  openSignInDialog() {
    this.dialogRef.close();
    this.matDialog.open(SignInDialogComponent, {
      disableClose: true,
      data: {
        checkout: this.data?.checkout,
      },
    });
  }
}
