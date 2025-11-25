import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { HistoryService } from '../../../services/history.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard-home',
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css',
})
export class DashboardHomeComponent implements OnInit {
  totalRecipes = 0; // ✅ AÑADIDO: Total de recetas
  recipesToday = 0; // ✅ AÑADIDO: Recetas generadas hoy
  totalFavorites = 0;
  historyCount = 0;
  thisWeekCount = 0;
  newRecipesThisMonth = 0; // Cambiado a contar recetas, no items
  isLoading = true;

  recentActivities: any[] = [];

  constructor(private router: Router, private historyService: HistoryService) {}

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  goToGenerate() {
    this.router.navigate(['/dashboard/generate']);
  }

  loadDashboardStats(): void {
    this.isLoading = true;

    // Cargar todas las páginas de historial
    forkJoin({
      history: this.historyService.getHistory(1),
      pages: this.historyService.getPageCount(),
    }).subscribe({
      next: ({ history, pages }) => {
        // Calcular estadísticas reales
        this.historyCount = history.length;

        // ✅ CONTAR TOTAL DE RECETAS
        this.totalRecipes = history.reduce((total, item) => {
          return total + (this.getRecipes(item).length || 0);
        }, 0);

        // Contar favoritos
        this.totalFavorites = history.filter((item) => item.isFavorite).length;

        // Contar items de esta semana (no recetas)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        this.thisWeekCount = history.filter((item) => {
          return new Date(item.createdAt) > oneWeekAgo;
        }).length;

        // ✅ CONTAR RECETAS DE HOY
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        this.recipesToday = history.reduce((total, item) => {
          const itemDate = new Date(item.createdAt);
          itemDate.setHours(0, 0, 0, 0);

          if (itemDate.getTime() === today.getTime()) {
            return total + (this.getRecipes(item).length || 0);
          }
          return total;
        }, 0);

        // ✅ CONTAR RECETAS DE ESTE MES (no items)
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        this.newRecipesThisMonth = history.reduce((total, item) => {
          if (new Date(item.createdAt) > oneMonthAgo) {
            return total + (this.getRecipes(item).length || 0);
          }
          return total;
        }, 0);

        // Generar actividad reciente
        this.generateRecentActivities(history);

        console.log('📊 Estadísticas cargadas:', {
          totalRecipes: this.totalRecipes,
          recipesToday: this.recipesToday,
          totalFavorites: this.totalFavorites,
          historyCount: this.historyCount,
          thisWeekCount: this.thisWeekCount,
          newRecipesThisMonth: this.newRecipesThisMonth,
        });

        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error cargando estadísticas:', error);
        this.isLoading = false;
      },
    });
  }

  // ✅ MÉTODO PARA OBTENER RECETAS (maneja español e inglés)
  getRecipes(item: any): any[] {
    return item?.generation?.recetas || item?.generation?.recipes || [];
  }

  generateRecentActivities(history: any[]): void {
    // Tomar los últimos 3 items del historial
    const recent = history.slice(0, 3);

    this.recentActivities = recent.map((item) => {
      const recipeCount = this.getRecipes(item).length;
      const recipeName =
        this.getRecipes(item)[0]?.nombre ||
        this.getRecipes(item)[0]?.title ||
        'Receta';
      const timeDiff = this.getTimeDifference(item.createdAt);

      return {
        icon: 'pi pi-sparkles',
        colorClass: 'bg-purple-500',
        title: 'Recetas generadas',
        description: `${recipeCount} nuevas recetas: ${recipeName}`,
        time: timeDiff,
      };
    });
  }

  getTimeDifference(date: string): string {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Hace ${diffMins} minutos`;
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    return `Hace ${diffDays} días`;
  }

  goToHistory(): void {
    this.router.navigate(['/dashboard/history']);
  }
}
