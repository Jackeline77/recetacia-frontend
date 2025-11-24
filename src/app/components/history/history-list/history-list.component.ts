import { Component, OnInit } from '@angular/core';
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
  ],
  templateUrl: './history-list.component.html',
  styleUrl: './history-list.component.css',
})
export class HistoryListComponent implements OnInit {
  historyItems: HistoryItem[] = [];
  currentPage = 1;
  totalPages = 1;
  isLoading = false;

  constructor(
    private historyService: HistoryService,
    private loadingService: LoadingService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadHistory();
    this.loadPageCount();
  }

  loadHistory(): void {
    this.isLoading = true;
    this.historyService.getHistory(this.currentPage).subscribe({
      next: (data) => {
        this.historyItems = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading history:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el historial',
        });
        this.isLoading = false;
      },
    });
  }

  loadPageCount(): void {
    this.historyService.getPageCount().subscribe({
      next: (data) => {
        this.totalPages = data.totalPages;
      },
    });
  }

  viewDetails(historyId: number): void {
    this.router.navigate(['/dashboard/history', historyId]);
  }

  toggleFavorite(item: HistoryItem): void {
    this.historyService.toggleFavorite(item.id).subscribe({
      next: () => {
        item.isFavorite = !item.isFavorite;
        this.messageService.add({
          severity: 'success',
          summary: item.isFavorite
            ? 'Añadido a favoritos'
            : 'Quitado de favoritos',
          detail: item.isFavorite
            ? 'La receta fue marcada como favorita'
            : 'La receta fue desmarcada',
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el favorito',
        });
      },
    });
  }

  confirmDelete(historyId: number): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar este historial?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteHistory(historyId);
      },
    });
  }

  deleteHistory(historyId: number): void {
    this.loadingService.show('Eliminando...');
    this.historyService.deleteHistory(historyId).subscribe({
      next: () => {
        this.loadingService.hide();
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Historial eliminado correctamente',
        });
        this.loadHistory();
      },
      error: () => {
        this.loadingService.hide();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el historial',
        });
      },
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1;
    this.loadHistory();
  }
}
