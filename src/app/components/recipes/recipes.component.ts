import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HistoryService, HistoryItem, Recipe } from '../../services/history.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ChipModule } from 'primeng/chip';
import { DataViewModule } from 'primeng/dataview';

interface RecipeWithHistory extends Recipe {
  historyId: number;
  createdAt: string;
  imageUrl: string;
  isFavorite: boolean;
}

@Component({
  selector: 'app-recipes',
  imports: [CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    ChipModule,],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css'
})
export class RecipesComponent implements OnInit {
  allRecipes: RecipeWithHistory[] = [];
  filteredRecipes: RecipeWithHistory[] = [];
  isLoading = false;
  searchTerm = '';
  sortBy = 'newest';

  sortOptions = [
    { label: 'Más Recientes', value: 'newest' },
    { label: 'Más Antiguas', value: 'oldest' },
    { label: 'Nombre A-Z', value: 'name-asc' },
    { label: 'Nombre Z-A', value: 'name-desc' }
  ];

  constructor(
    private historyService: HistoryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAllRecipes();
  }

  loadAllRecipes(): void {
    this.isLoading = true;

    this.historyService.getHistory(1).subscribe({
      next: (historyItems) => {
        // Extraer todas las recetas de todos los items del historial
        this.allRecipes = [];

        historyItems.forEach(item => {
          item.generation.recetas.forEach(receta => {
            this.allRecipes.push({
              ...receta,
              historyId: item.id,
              createdAt: item.createdAt,
              imageUrl: item.imageUrl,
              isFavorite: item.isFavorite
            });
          });
        });

        console.log('✅ Todas las recetas cargadas:', this.allRecipes.length);
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error cargando recetas:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let result = [...this.allRecipes];

    // Aplicar búsqueda
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(recipe =>
        recipe.nombre.toLowerCase().includes(term) ||
        recipe.descripcion.toLowerCase().includes(term) ||
        recipe.ingredientes.some(ing => ing.toLowerCase().includes(term))
      );
    }

    // Aplicar ordenamiento
    switch (this.sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'name-asc':
        result.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'name-desc':
        result.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
    }

    this.filteredRecipes = result;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  viewRecipe(historyId: number): void {
    this.router.navigate(['/dashboard/history', historyId]);
  }

  goToGenerate(): void {
    this.router.navigate(['/dashboard/generate']);
  }

  get favoriteRecipesCount(): number {
    return this.allRecipes.filter(r => r.isFavorite).length;
  }

  get historyCount(): number {
    return new Set(this.allRecipes.map(r => r.historyId)).size;
  }

  get uniqueIngredientsCount(): number {
    const allIngredients = new Set<string>();
    this.allRecipes.forEach(recipe => {
      recipe.ingredientes.forEach(ing => allIngredients.add(ing.toLowerCase()));
    });
    return allIngredients.size;
  }
}
