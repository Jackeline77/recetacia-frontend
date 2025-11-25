import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HistoryService } from '../../services/history.service';
import { LoadingService } from '../../services/loading.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { AuthImageComponent } from '../shared/auth-image/auth-image.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    ToastModule,
    TooltipModule,
    AuthImageComponent,
  ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit, OnDestroy {
  favoriteItems: any[] = [];
  isLoading = false;
  isDarkMode = false;
  private themeChangeListener?: () => void;

  constructor(
    private historyService: HistoryService,
    private loadingService: LoadingService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadFavorites();
    this.checkDarkMode();
    this.setupThemeListener();
  }

  ngOnDestroy(): void {
    if (this.themeChangeListener) {
      this.themeChangeListener();
    }
  }

  setupThemeListener(): void {
    // Escuchar cambios en el tema
    this.themeChangeListener = () => this.checkDarkMode();
    
    // Escuchar cambios en localStorage para tema
    window.addEventListener('storage', this.themeChangeListener);
    
    // Escuchar cambios de clase en el html
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          this.checkDarkMode();
        }
      });
    });
    
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
      observer.observe(htmlElement, { attributes: true });
    }
  }

  checkDarkMode(): void {
    // Verificar si el tema oscuro está activo
    const htmlElement = document.querySelector('html');
    this.isDarkMode = htmlElement?.classList.contains('dark') || 
                     localStorage.getItem('theme') === 'dark' ||
                     localStorage.getItem('darkMode') === 'true';
  }

  loadFavorites(): void {
    this.isLoading = true;

    // Cargar todos los items del historial y filtrar favoritos
    this.historyService.getHistory(1).subscribe({
      next: (data) => {
        this.favoriteItems = data.filter(item => item.isFavorite);
        console.log('✅ Favoritos cargados:', this.favoriteItems);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error cargando favoritos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los favoritos'
        });
        this.isLoading = false;
      }
    });
  }

  // Método seguro para obtener recetas (maneja español e inglés)
  getRecipes(item: any): any[] {
    return item?.generation?.recetas || item?.generation?.recipes || [];
  }

  // Método seguro para obtener nombre de receta
  getRecipeName(recipe: any): string {
    return recipe?.nombre || recipe?.title || 'Receta sin nombre';
  }

  viewDetails(historyId: number): void {
    this.router.navigate(['/dashboard/history', historyId]);
  }

  removeFavorite(item: any): void {
    this.loadingService.show('Quitando de favoritos...');

    this.historyService.toggleFavorite(item.id).subscribe({
      next: () => {
        this.loadingService.hide();

        // Remover del array local
        this.favoriteItems = this.favoriteItems.filter(fav => fav.id !== item.id);

        this.messageService.add({
          severity: 'success',
          summary: 'Quitado de favoritos',
          detail: 'La receta fue removida de favoritos'
        });
      },
      error: (error) => {
        this.loadingService.hide();
        console.error('❌ Error:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo quitar de favoritos'
        });
      }
    });
  }

  goToHistory(): void {
    this.router.navigate(['/dashboard/history']);
  }

  get totalRecipes(): number {
    return this.favoriteItems.reduce((total, item) => {
      return total + this.getRecipes(item).length;
    }, 0);
  }
}