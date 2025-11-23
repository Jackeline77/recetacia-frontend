import { Component } from '@angular/core';
import {
  Router,
  RouterOutlet,
  RouterModule,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingService } from './services/loading.service';
import { LoadingComponent } from './components/loading/loading.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingComponent, CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'recetacia-frontend';
  private navigationTimeout: any;

  constructor(private router: Router, private loadingService: LoadingService) {
    this.setupNavigationLoading();
  }
  private setupNavigationLoading() {
    let navigationStartTime: number;
    let currentUrl = '';

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        currentUrl = event.url;
      }

      if (event instanceof NavigationStart) {
        navigationStartTime = Date.now();

        // ⚠️ EXCLUIR test-loading - No mostrar loading aquí
        if (currentUrl.includes('/test-loading')) {
          return;
        }

        if (this.navigationTimeout) {
          clearTimeout(this.navigationTimeout);
        }

        // Solo mostrar loading si la navegación tarda más de 200ms
        this.navigationTimeout = setTimeout(() => {
          const elapsed = Date.now() - navigationStartTime;
          console.log(
            ' Navegación lenta detectada (' +
              elapsed +
              'ms) - Mostrando loading'
          );
          this.loadingService.show('Cargando ' + this.getPageName(event.url));
        }, 100);
      }

      if (event instanceof NavigationEnd) {
        const totalTime = Date.now() - navigationStartTime;
        console.log(
          ' Navegación completada en ' + totalTime + 'ms - URL:',
          event.url
        );

        //  EXCLUIR test-loading - No procesar eventos aquí
        if (event.url.includes('/test-loading')) {
          return;
        }

        if (totalTime > 200) {
          // Si se mostró el loading, mantenerlo visible al menos 600ms más
          console.log('🕒 Manteniendo loading visible por 600ms más...');
          setTimeout(() => {
            this.cleanupLoading();
          }, 600);
        } else {
          this.cleanupLoading();
        }
      }

      if (
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        //  EXCLUIR test-loading
        if (currentUrl.includes('/test-loading')) {
          return;
        }
        this.cleanupLoading();
      }
    });
  }
  private getPageName(url: string): string {
    const pageNames: { [key: string]: string } = {
      '/login': 'Login',
      '/register': 'Registro',
      '/landing': 'Inicio',
      '/test-loading': 'Pruebas',
    };
    return pageNames[url] || 'página';
  }

  private cleanupLoading() {
    if (this.navigationTimeout) {
      clearTimeout(this.navigationTimeout);
      this.navigationTimeout = null;
    }

    //  AGREGAR DELAY MÍNIMO de 500ms para que el loading sea visible
    setTimeout(() => {
      this.loadingService.hide();
      console.log('👋 Loading ocultado después de delay mínimo');
    }, 500);
  }
}
