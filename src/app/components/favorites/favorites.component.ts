import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HistoryService, HistoryItem } from '../../services/history.service';
import { LoadingService } from '../../services/loading.service';
import { CardModule } from 'primeng/card';
import { ButtonModule, Button } from 'primeng/button';
import { TagModule, Tag } from 'primeng/tag';
import { ToastModule, Toast } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { AuthImageComponent } from '../shared/auth-image/auth-image.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, CardModule, Button, Tag, Toast, ButtonModule, TooltipModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  favoriteItems: HistoryItem[] = [];
  isLoading = false;

  constructor(
    private historyService: HistoryService,
    private loadingService: LoadingService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadFavorites();
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

  viewDetails(historyId: number): void {
    this.router.navigate(['/dashboard/history', historyId]);
  }

  removeFavorite(item: HistoryItem): void {
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
      return total + item.generation.recetas.length;
    }, 0);
  }
}