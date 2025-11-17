import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-test-connection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="test-container">
      <h2>🔧 Prueba de Conexión Backend</h2>

      <div class="test-section">
        <h3>Estado de Conexión</h3>
        <div [class]="connectionStatus.class">
          {{ connectionStatus.message }}
        </div>
      </div>

      <div class="test-section">
        <h3>Prueba de Registro</h3>
        <button (click)="testRegister()" [disabled]="loading">
          {{ loading ? 'Probando...' : 'Probar Registro' }}
        </button>
        <div
          *ngIf="registerResult"
          [class]="registerResult.success ? 'success' : 'error'"
        >
          <pre>{{ registerResult.message | json }}</pre>
        </div>
      </div>

      <div class="test-section">
        <h3>Prueba de Login</h3>
        <button (click)="testLogin()" [disabled]="loading">
          {{ loading ? 'Probando...' : 'Probar Login' }}
        </button>
        <div
          *ngIf="loginResult"
          [class]="loginResult.success ? 'success' : 'error'"
        >
          <pre>{{ loginResult.message | json }}</pre>
        </div>
      </div>

      <div class="test-section" *ngIf="token">
        <h3>Token JWT Recibido</h3>
        <div class="token-display">
          <p><strong>Token:</strong></p>
          <code>{{ token }}</code>
        </div>
      </div>

      <div class="instructions">
        <h4>📋 Instrucciones:</h4>
        <ol>
          <li>
            Asegúrate de que tu backend esté corriendo en
            <code>http://localhost:3000</code>
          </li>
          <li>Primero prueba el botón "Probar Registro"</li>
          <li>
            Luego prueba el botón "Probar Login" con las mismas credenciales
          </li>
          <li>Si ambas pruebas son exitosas, verás el token JWT</li>
        </ol>
      </div>
    </div>
  `,
  styles: [
    `
      .test-container {
        max-width: 800px;
        margin: 40px auto;
        padding: 20px;
        font-family: Arial, sans-serif;
      }

      h2 {
        color: #333;
        border-bottom: 3px solid #667eea;
        padding-bottom: 10px;
      }

      .test-section {
        margin: 30px 0;
        padding: 20px;
        background: #f5f5f5;
        border-radius: 8px;
      }

      h3 {
        color: #555;
        margin-top: 0;
      }

      button {
        background: #667eea;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        font-size: 14px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s;
      }

      button:hover:not(:disabled) {
        background: #5568d3;
        transform: translateY(-2px);
      }

      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .success {
        background: #d4edda;
        color: #155724;
        padding: 15px;
        border-radius: 6px;
        margin-top: 15px;
        border: 1px solid #c3e6cb;
      }

      .error {
        background: #f8d7da;
        color: #721c24;
        padding: 15px;
        border-radius: 6px;
        margin-top: 15px;
        border: 1px solid #f5c6cb;
      }

      .info {
        background: #d1ecf1;
        color: #0c5460;
        padding: 15px;
        border-radius: 6px;
        margin-top: 15px;
        border: 1px solid #bee5eb;
      }

      .warning {
        background: #fff3cd;
        color: #856404;
        padding: 15px;
        border-radius: 6px;
        margin-top: 15px;
        border: 1px solid #ffeeba;
      }

      pre {
        white-space: pre-wrap;
        word-wrap: break-word;
      }

      .token-display {
        background: white;
        padding: 15px;
        border-radius: 6px;
        border: 1px solid #ddd;
      }

      code {
        background: #f4f4f4;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        word-break: break-all;
        display: block;
        margin-top: 10px;
      }

      .instructions {
        background: #e7f3ff;
        padding: 20px;
        border-radius: 8px;
        margin-top: 30px;
        border-left: 4px solid #667eea;
      }

      .instructions h4 {
        margin-top: 0;
        color: #667eea;
      }

      .instructions ol {
        margin: 10px 0;
        padding-left: 20px;
      }

      .instructions li {
        margin: 8px 0;
      }
    `,
  ],
})
export class TestConnectionComponent implements OnInit {
  loading = false;
  token: string | null = null;
  connectionStatus = {
    message: '⏳ Esperando pruebas...',
    class: 'info',
  };
  registerResult: any = null;
  loginResult: any = null;

  // Credenciales de prueba
  private testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123!',
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.checkConnection();
  }

  checkConnection(): void {
    this.connectionStatus = {
      message: '✅ Backend configurado para: http://localhost:3000/auth',
      class: 'info',
    };
  }

  testRegister(): void {
    this.loading = true;
    this.registerResult = null;

    console.log('🔵 Probando registro con:', this.testUser);

    this.authService.register(this.testUser).subscribe({
      next: (response) => {
        console.log('✅ Registro exitoso:', response);
        this.token = response.access_token;
        this.registerResult = {
          success: true,
          message: {
            status: 'SUCCESS',
            access_token: response.access_token,
            mensaje: '¡Usuario registrado correctamente!',
          },
        };
        this.connectionStatus = {
          message: '✅ Conexión exitosa con el backend',
          class: 'success',
        };
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error en registro:', error);
        this.registerResult = {
          success: false,
          message: {
            status: 'ERROR',
            error: error.error?.message || error.message,
            statusCode: error.status,
            consejo:
              error.status === 409
                ? 'El usuario ya existe. Intenta con el Login.'
                : error.status === 0
                ? '❌ No se puede conectar al backend. Verifica que esté corriendo en http://localhost:3000'
                : 'Verifica los datos enviados',
          },
        };
        this.connectionStatus = {
          message:
            error.status === 0
              ? '❌ Backend no responde - Verifica que esté corriendo'
              : '⚠️ Backend responde pero hay un error',
          class: error.status === 0 ? 'error' : 'warning',
        };
        this.loading = false;
      },
    });
  }

  testLogin(): void {
    this.loading = true;
    this.loginResult = null;

    const loginData = {
      email: this.testUser.email,
      password: this.testUser.password,
    };

    console.log('🔵 Probando login con:', loginData);

    this.authService.login(loginData).subscribe({
      next: (response) => {
        console.log('✅ Login exitoso:', response);
        this.token = response.access_token;
        this.loginResult = {
          success: true,
          message: {
            status: 'SUCCESS',
            access_token: response.access_token,
            mensaje: '¡Login exitoso! Token guardado en localStorage',
          },
        };
        this.connectionStatus = {
          message: '✅ Autenticación funcionando correctamente',
          class: 'success',
        };
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error en login:', error);
        this.loginResult = {
          success: false,
          message: {
            status: 'ERROR',
            error: error.error?.message || error.message,
            statusCode: error.status,
            consejo:
              error.status === 401
                ? 'Credenciales incorrectas o usuario no registrado. Prueba primero el Registro.'
                : error.status === 0
                ? '❌ No se puede conectar al backend. Verifica que esté corriendo en http://localhost:3000'
                : 'Error al procesar la solicitud',
          },
        };
        this.loading = false;
      },
    });
  }
}
