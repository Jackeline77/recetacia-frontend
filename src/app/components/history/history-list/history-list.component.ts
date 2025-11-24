import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HistoryService, HistoryItem } from '../../../services/history.service';
import { LoadingService } from '../../../services/loading.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { AuthImageComponent } from '../../shared/auth-image/auth-image.component';

@Component({
  selector: 'app-history-list',
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    PaginatorModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
    ButtonModule,
    AuthImageComponent,
  ],
  templateUrl: './history-list.component.html',
  styleUrl: './history-list.component.css',
})
export class HistoryListComponent implements OnInit {
  private historyService = inject(HistoryService);
  private loadingService = inject(LoadingService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  historyItems: any[] = [];
  isLoading = true;
  currentPage = 1;
  totalPages = 1;

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.isLoading = true;
    this.historyService.getHistory(this.currentPage).subscribe({
      next: (historyItems: any[]) => {
        // ✅ Ahora recibimos el array directamente
        this.historyItems = historyItems || [];

        // Obtener total de páginas por separado
        this.historyService.getPageCount().subscribe({
          next: (pageInfo) => {
            this.totalPages = pageInfo.totalPages || 1;
            this.isLoading = false;
            console.log('✅ Historial cargado:', this.historyItems);
            console.log('📄 Total de páginas:', this.totalPages);
          },
          error: (error) => {
            console.error('❌ Error cargando páginas:', error);
            this.totalPages = 1;
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('❌ Error cargando historial:', error);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el historial',
        });
      },
    });
  }

  // Método seguro para obtener recetas - maneja español e inglés
  getRecipes(item: any): any[] {
    return item?.generation?.recetas || item?.generation?.recipes || [];
  }

  // Método seguro para obtener nombre de receta - maneja español e inglés
  getRecipeName(recipe: any): string {
    return recipe?.nombre || recipe?.title || 'Receta sin nombre';
  }

  // Método seguro para obtener descripción - maneja español e inglés
  getRecipeDescription(recipe: any): string {
    return (
      recipe?.descripcion || recipe?.description || 'Sin descripción disponible'
    );
  }

  // Método seguro para obtener ingredientes - maneja español e inglés
  getRecipeIngredients(recipe: any): string[] {
    return recipe?.ingredientes || recipe?.ingredients || [];
  }

  // Método seguro para obtener tiempo de preparación - maneja español e inglés
  getRecipeTime(recipe: any): string {
    return (
      recipe?.tiempoPreparacion ||
      (recipe?.prep_time_minutes
        ? `${recipe.prep_time_minutes} minutos`
        : 'Tiempo no especificado')
    );
  }

  viewDetails(itemId: number): void {
    this.router.navigate(['/dashboard/history', itemId]);
  }

  toggleFavorite(item: any): void {
    this.historyService.toggleFavorite(item.id).subscribe({
      next: (updatedItem) => {
        item.isFavorite = updatedItem.isFavorite;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: item.isFavorite
            ? 'Añadido a favoritos'
            : 'Quitado de favoritos',
        });
      },
      error: (error) => {
        console.error('Error al actualizar favorito:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el favorito',
        });
      },
    });
  }

  confirmDelete(itemId: number): void {
    this.confirmationService.confirm({
      message:
        '¿Estás seguro de que quieres eliminar esta entrada del historial?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.deleteItem(itemId);
      },
    });
  }

  private deleteItem(itemId: number): void {
    this.historyService.deleteHistory(itemId).subscribe({
      next: () => {
        this.historyItems = this.historyItems.filter(
          (item) => item.id !== itemId
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Entrada eliminada correctamente',
        });
      },
      error: (error) => {
        console.error('Error eliminando item:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la entrada',
        });
      },
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadHistory();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadHistory();
    }
  }
}
