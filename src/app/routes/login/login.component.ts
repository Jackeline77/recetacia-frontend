import { Component, Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    DividerModule,
    ButtonModule,
    InputTextModule,
    CommonModule,
    ReactiveFormsModule,
    CardModule,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      console.log('📤 Enviando datos de login:', this.loginForm.value);

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('✅ Login exitoso', response);
          // Redirigir al dashboard o landing
          this.router.navigate(['/landing']); // Cambia a '/dashboard' cuando lo crees
        },
        error: (error) => {
          console.error('❌ Error en login:', error);

          // Manejo de errores más específico
          if (error.status === 401) {
            this.errorMessage = 'Email o contraseña incorrectos';
          } else if (error.status === 500) {
            this.errorMessage =
              'Error del servidor. Por favor, intenta más tarde';
          } else if (error.status === 0) {
            this.errorMessage =
              'No se puede conectar al servidor. Verifica tu conexión';
          } else {
            this.errorMessage =
              error.error?.message || 'Error al iniciar sesión';
          }

          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  goBack(): void {
    this.router.navigate(['/landing']);
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
