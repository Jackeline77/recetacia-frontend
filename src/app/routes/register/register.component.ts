import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FloatLabelModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    MessageModule,
    CheckboxModule,
    DialogModule,        // Para p-dialog
    ScrollPanelModule,   // Para p-scrollpanel
    ButtonModule         // Para p-button
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  // Variables para el modal de términos
  displayTermsModal: boolean = false;
  currentTermIndex: number = 0;

  // Contenido de términos organizado en "páginas"
  termsContent: any[] = [
    {
      title: 'Términos de Uso',
      content: [
        'Al registrarte en <strong>Recetacia</strong>, aceptas cumplir con estos términos y condiciones. El servicio está destinado para uso personal y no comercial.',
        'No puedes utilizar la plataforma para actividades ilegales o no autorizadas. El acceso y uso del servicio está sujeto a tu aceptación y cumplimiento de estos términos.',
        'Nos reservamos el derecho de modificar o discontinuar el servicio en cualquier momento, con o sin previo aviso. El uso continuado del servicio después de tales cambios constituye tu aceptación de los nuevos términos.'
      ]
    },
    {
      title: 'Cuenta y Seguridad',
      content: [
        'Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran bajo tu cuenta. Debes notificarnos inmediatamente cualquier uso no autorizado de tu cuenta.',
        'Debes proporcionar información precisa y actualizada en tu perfil. No puedes compartir tu cuenta con terceros sin autorización expresa.',
        'Nos reservamos el derecho de suspender o cancelar cuentas que violen estos términos, o por cualquier motivo a nuestra discreción, con o sin previo aviso.'
      ]
    },
    {
      title: 'Contenido y Recetas',
      content: [
        'Las recetas compartidas deben ser originales o tener los derechos necesarios para su publicación. Nos reservamos el derecho de eliminar contenido inapropiado, ofensivo o que viole derechos de autor.',
        'Al publicar recetas, otorgas a Recetacia una licencia no exclusiva, libre de regalías, para usar, mostrar y distribuir dicho contenido dentro de la plataforma.',
        'Eres responsable del contenido que publicas y garantizas que tienes todos los derechos necesarios para compartirlo. No publicarás contenido que infrinja derechos de terceros.'
      ]
    },
    {
      title: 'Privacidad de Datos',
      content: [
        'Respetamos tu privacidad. Tu información personal será utilizada únicamente para mejorar tu experiencia en la plataforma y no será compartida con terceros sin tu consentimiento explícito.',
        'Podemos utilizar datos anónimos para análisis estadísticos y mejora continua del servicio. Consulta nuestra Política de Privacidad completa para más detalles sobre el tratamiento de datos.',
        'Implementamos medidas de seguridad para proteger tu información, pero no podemos garantizar la seguridad absoluta de los datos transmitidos a través de Internet.'
      ]
    },
    {
      title: 'Limitación de Responsabilidad',
      content: [
        'No nos hacemos responsables por alergias, reacciones adversas o cualquier problema de salud derivado del uso de las recetas publicadas. Los usuarios deben verificar los ingredientes según sus necesidades dietéticas.',
        'Recetacia no garantiza la exactitud nutricional, calidad o seguridad de las recetas publicadas por los usuarios. Siempre consulta con profesionales de la salud cuando sea necesario.',
        'El servicio se proporciona "tal cual" y "según disponibilidad". No garantizamos que el servicio sea ininterrumpido, oportuno, seguro o libre de errores.'
      ]
    },
    {
      title: 'Propiedad Intelectual',
      content: [
        'Todos los derechos de propiedad intelectual sobre la plataforma, su diseño, logotipos, código y contenido original pertenecen a Recetacia. No puedes copiar, modificar o distribuir ningún elemento sin autorización.',
        'Las recetas publicadas por usuarios son responsabilidad de sus respectivos autores, quienes conservan los derechos sobre su contenido original.',
        'Al publicar contenido en Recetacia, mantienes tus derechos de propiedad intelectual, pero nos otorgas una licencia para mostrar y distribuir dicho contenido dentro de la plataforma.'
      ]
    }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService 
  ) {
    this.registerForm = this.createForm();
  }

  showTermsModal() {
    this.displayTermsModal = true;
    this.currentTermIndex = 0; // Reiniciar al primer término
  }

  nextTerm() {
    if (this.currentTermIndex < this.termsContent.length - 1) {
      this.currentTermIndex++;
    }
  }

  previousTerm() {
    if (this.currentTermIndex > 0) {
      this.currentTermIndex--;
    }
  }

  acceptTermsAndClose() {
    this.registerForm.patchValue({ acceptTerms: true });
    this.displayTermsModal = false;
  }

  private createForm(): FormGroup {
    return this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$'),
          ],
        ],
        confirmPassword: ['', Validators.required],
        acceptTerms: [false, Validators.requiredTrue],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  private passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  get f() {
    return this.registerForm.controls;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.f[fieldName];
    return field.invalid && (field.dirty || field.touched);
  }

  goBack() {
    this.router.navigate(['/landing']);
  }

onSubmit() {
  this.markAllFieldsAsTouched();
  this.errorMessage = '';

  if (this.registerForm.invalid) {
    return;
  }

  this.isLoading = true;

  // USAR EL AUTH SERVICE REAL
  const userData = {
    name: this.registerForm.value.name,
    email: this.registerForm.value.email,
    password: this.registerForm.value.password
  };

  this.authService.register(userData).subscribe({
    next: (response) => {
      console.log('✅ Registro exitoso', response);
      this.isLoading = false;
      // El AuthService ya guarda el token automáticamente
      this.router.navigate(['/dashboard']);
    },
    error: (error) => {
      console.error('❌ Error en registro:', error);
      this.isLoading = false;
      
      if (error.status === 400) {
        this.errorMessage = 'El email ya está registrado';
      } else if (error.status === 500) {
        this.errorMessage = 'Error del servidor. Intenta más tarde';
      } else if (error.status === 0) {
        this.errorMessage = 'No se puede conectar al servidor';
      } else {
        this.errorMessage = error.error?.message || 'Error al registrar usuario';
      }
    }
  });
}

  onReset() {
    this.errorMessage = '';
    this.registerForm.reset();
    Object.keys(this.f).forEach(key => {
      this.f[key].markAsPristine();
      this.f[key].markAsUntouched();
    });
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.f).forEach(key => {
      this.f[key].markAsTouched();
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}