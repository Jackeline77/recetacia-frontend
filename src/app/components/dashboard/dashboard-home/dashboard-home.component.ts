import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard-home',
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css',
})
export class DashboardHomeComponent implements OnInit {
  totalRecipes = 0;
  totalFavorites = 0;
  historyCount = 0;
  thisWeekCount = 0;
  newRecipesThisMonth = 0;

  recentActivities = [
    {
      icon: 'pi pi-sparkles',
      colorClass: 'bg-purple-500',
      title: 'Recetas generadas',
      description: '3 nuevas recetas de pasta italiana',
      time: 'Hace 2 horas',
    },
    {
      icon: 'pi pi-star',
      colorClass: 'bg-yellow-500',
      title: 'Añadido a favoritos',
      description: 'Pasta Carbonara marcada como favorita',
      time: 'Hace 5 horas',
    },
    {
      icon: 'pi pi-trash',
      colorClass: 'bg-red-500',
      title: 'Historial eliminado',
      description: 'Entrada del 15 de enero eliminada',
      time: 'Hace 1 día',
    },
  ];


  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadDashboardStats();
    // this.createCharts(); // Descomenta cuando quieras gráficos
  }

  loadDashboardStats(): void {
    // Aquí cargarías las estadísticas reales desde tu servicio
    // Ejemplo:
    this.totalRecipes = 24;
    this.totalFavorites = 8;
    this.historyCount = 12;
    this.thisWeekCount = 5;
    this.newRecipesThisMonth = 7;
  }

  goToGenerate(): void {
    this.router.navigate(['/dashboard/generate']);
  }

  goToHistory(): void {
    this.router.navigate(['/dashboard/history']);
  }

  private createCharts(): void {
    // Gráfico de recetas por mes
    const ctx = document.getElementById('recipesChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
          datasets: [{
            label: 'Recetas Generadas',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: 'rgba(147, 51, 234, 0.8)',
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            }
          }
        }
      });
    }
  }
}