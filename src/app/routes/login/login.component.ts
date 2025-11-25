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
import { MessageModule } from 'primeng/message';

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
    MessageModule,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  isLoading = false;
  backendErrors: { [key: string]: string } = {};
  accountNotFound = false; // ✅ Nueva variable para controlar cuenta no encontrada

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)]], 
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || field.dirty));
  }

  getFieldErrors(fieldName: string): string[] {
    const field = this.loginForm.get(fieldName);
    const errors = [];
    
    if (field?.errors?.['required']) {
      errors.push('required');
    }
    if (field?.errors?.['email']) {
      errors.push('email');
    }
    if (field?.errors?.['minlength']) {
      errors.push('minlength');
    }
    if (field?.errors?.['pattern']) {
      errors.push('pattern');
    }
    if (this.backendErrors[fieldName]) {
      errors.push('backend');
    }
    
    return errors;
  }

  onSubmit(): void {
    this.markFormGroupTouched(this.loginForm);
    this.errorMessage = '';
    this.backendErrors = {};
    this.accountNotFound = false; // ✅ Resetear estado de cuenta no encontrada

    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;

    console.log('📤 Enviando datos de login:', this.loginForm.value);

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('✅ Login exitoso', response);
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('❌ Error en login:', error);
        console.error('❌ Error completo:', error.error);
        this.isLoading = false;

        // ✅ MEJORADO: Manejo específico para cuenta no encontrada
        if (error.status === 401) {
          const errorMsg = error.error?.message?.toLowerCase() || '';
          
          if (errorMsg.includes('password') || errorMsg.includes('contraseña')) {
            this.backendErrors['password'] = 'Contraseña incorrecta';
          } else if (errorMsg.includes('email') || errorMsg.includes('correo') || errorMsg.includes('not found') || errorMsg.includes('no existe')) {
            this.backendErrors['email'] = 'El email no está registrado';
            this.accountNotFound = true; // ✅ Activar estado de cuenta no encontrada
          } else {
            this.errorMessage = 'Email o contraseña incorrectos';
          }
        } else if (error.status === 400) {
          const errorMsg = error.error?.message?.toLowerCase() || '';
          
          if (errorMsg.includes('password') || errorMsg.includes('contraseña')) {
            if (errorMsg.includes('length') || errorMsg.includes('longitud') || errorMsg.includes('8')) {
              this.backendErrors['password'] = 'La contraseña debe tener al menos 8 caracteres';
            } else if (errorMsg.includes('invalid') || errorMsg.includes('inválida')) {
              this.backendErrors['password'] = 'Contraseña inválida';
            } else {
              this.backendErrors['password'] = error.error?.message || 'Error en la contraseña';
            }
          } 
          else if (errorMsg.includes('email') || errorMsg.includes('correo')) {
            if (errorMsg.includes('not found') || errorMsg.includes('no encontrado') || errorMsg.includes('no existe')) {
              this.backendErrors['email'] = 'El email no está registrado';
              this.accountNotFound = true; // ✅ Activar estado de cuenta no encontrada
            } else if (errorMsg.includes('invalid') || errorMsg.includes('inválido')) {
              this.backendErrors['email'] = 'Formato de email inválido';
            } else {
              this.backendErrors['email'] = error.error?.message || 'Error en el email';
            }
          }
          else if (Array.isArray(error.error?.message)) {
            this.errorMessage = error.error.message.join(', ');
          } else {
            this.errorMessage = errorMsg || 'Datos inválidos';
          }
        } else if (error.status === 404) {
          // Email no encontrado
          this.backendErrors['email'] = 'El email no está registrado';
          this.accountNotFound = true; // ✅ Activar estado de cuenta no encontrada
        } else if (error.status === 422) {
          const errorMsg = error.error?.message?.toLowerCase() || '';
          if (errorMsg.includes('password')) {
            this.backendErrors['password'] = 'La contraseña no cumple con los requisitos';
          } else if (errorMsg.includes('email')) {
            this.backendErrors['email'] = 'El email no existe';
            this.accountNotFound = true; // ✅ Activar estado de cuenta no encontrada
          } else {
            this.errorMessage = 'Datos de login inválidos';
          }
        } else if (error.status === 500) {
          this.errorMessage = 'Error del servidor. Por favor, intenta más tarde';
        } else if (error.status === 0) {
          this.errorMessage = 'No se puede conectar al servidor. Verifica tu conexión';
        } else {
          this.errorMessage = error.error?.message || 'Error al iniciar sesión';
        }

        // ✅ SI LA CUENTA NO EXISTE, QUEDARSE EN EL LOGIN (no hacer nada)
        // El usuario permanece en la página para que pueda registrarse
        this.updateFormValidation(error);
      }
    });
  }

  private updateFormValidation(error: any): void {
    const errorMsg = error.error?.message?.toLowerCase() || '';
    
    if (errorMsg.includes('password') || errorMsg.includes('contraseña')) {
      this.f['password'].setErrors({ backendError: true });
      this.f['password'].markAsTouched();
    }
    
    if (errorMsg.includes('email') || errorMsg.includes('correo')) {
      this.f['email'].setErrors({ backendError: true });
      this.f['email'].markAsTouched();
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
  
  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  onFieldChange(fieldName: string): void {
    this.errorMessage = '';
    
    if (this.backendErrors[fieldName]) {
      delete this.backendErrors[fieldName];
    }
    
    // ✅ Resetear estado de cuenta no encontrada cuando el usuario edita el email
    if (fieldName === 'email' && this.accountNotFound) {
      this.accountNotFound = false;
    }
    
    const field = this.loginForm.get(fieldName);
    if (field?.hasError('backendError')) {
      field.setErrors(null);
    }
  }

  // ✅ Método para ir al registro cuando la cuenta no existe
  goToRegisterFromError(): void {
    this.router.navigate(['/register']);
  }
}