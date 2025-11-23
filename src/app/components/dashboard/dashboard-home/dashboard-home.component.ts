import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-dashboard-home',
  imports: [CommonModule, CardModule, ButtonModule, ChartModule],
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

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadDashboardStats();
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
}
