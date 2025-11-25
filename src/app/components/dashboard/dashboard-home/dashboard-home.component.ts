import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { HistoryService } from '../../../services/history.service';
import { forkJoin } from 'rxjs';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-dashboard-home',
  imports: [CommonModule, CardModule, ButtonModule,ToastModule],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css',
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  totalRecipes = 0;
  recipesToday = 0;
  totalFavorites = 0;
  historyCount = 0;
  thisWeekCount = 0;
  newRecipesThisMonth = 0;
  isLoading = true;
  isDarkMode = false;
  private themeChangeListener?: () => void;

  recentActivities: any[] = [];

  constructor(private router: Router, private historyService: HistoryService) {}

  ngOnInit(): void {
    this.loadDashboardStats();
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
    
    console.log('🔍 Modo oscuro detectado:', this.isDarkMode);
  }

  goToGenerate() {
    this.router.navigate(['/dashboard/generate']);
  }

  loadDashboardStats(): void {
    this.isLoading = true;

    forkJoin({
      history: this.historyService.getHistory(1),
      pages: this.historyService.getPageCount(),
    }).subscribe({
      next: ({ history, pages }) => {
        this.historyCount = history.length;
        this.totalRecipes = history.reduce((total, item) => {
          return total + (this.getRecipes(item).length || 0);
        }, 0);

        // Contar favoritos
        this.totalFavorites = history.filter((item) => item.isFavorite).length;

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        this.thisWeekCount = history.filter((item) => {
          return new Date(item.createdAt) > oneWeekAgo;
        }).length;

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

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        this.newRecipesThisMonth = history.reduce((total, item) => {
          if (new Date(item.createdAt) > oneMonthAgo) {
            return total + (this.getRecipes(item).length || 0);
          }
          return total;
        }, 0);

        this.generateRecentActivities(history);
        this.isLoading = false;
        
        console.log('📊 Estadísticas cargadas:', {
          totalRecipes: this.totalRecipes,
          recipesToday: this.recipesToday,
          totalFavorites: this.totalFavorites,
          historyCount: this.historyCount,
          thisWeekCount: this.thisWeekCount,
          newRecipesThisMonth: this.newRecipesThisMonth,
        });
      },
      error: (error) => {
        console.error('❌ Error cargando estadísticas:', error);
        this.isLoading = false;
      },
    });
  }

  getRecipes(item: any): any[] {
    return item?.generation?.recetas || item?.generation?.recipes || [];
  }

  generateRecentActivities(history: any[]): void {
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
    
    console.log('📝 Actividades recientes generadas:', this.recentActivities);
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


  // Método para forzar recarga del tema (útil para debugging)
  refreshTheme(): void {
    this.checkDarkMode();
  }
}
