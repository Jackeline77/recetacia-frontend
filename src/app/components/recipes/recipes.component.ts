import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  HistoryService,
  HistoryItem,
  Recipe,
} from '../../services/history.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ChipModule } from 'primeng/chip';
import { DataViewModule } from 'primeng/dataview';
import { AuthImageComponent } from '../shared/auth-image/auth-image.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';

interface RecipeWithHistory extends Recipe {
  historyId: number;
  createdAt: string;
  imageUrl: string;
  isFavorite: boolean;
}

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    ChipModule,
    DataViewModule,
    AuthImageComponent,
    InputIconModule,
    IconFieldModule,
    MultiSelectModule,
  ],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css',
})
export class RecipesComponent implements OnInit, OnDestroy {
  allRecipes: RecipeWithHistory[] = [];
  filteredRecipes: RecipeWithHistory[] = [];
  isLoading = false;
  searchTerm = '';
  sortBy: string[] = ['newest'];
  isDarkMode = false;
  private mutationObserver?: MutationObserver;

  sortOptions = [
    { label: 'Más Recientes', value: 'newest' },
    { label: 'Más Antiguas', value: 'oldest' },
    { label: 'Nombre A-Z', value: 'name-asc' },
    { label: 'Nombre Z-A', value: 'name-desc' },
  ];

  constructor(private historyService: HistoryService, private router: Router) { }

  ngOnInit(): void {
    this.loadAllRecipes();
    this.checkDarkMode();
    this.setupThemeListener();
  }

  ngOnDestroy(): void {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }

  setupThemeListener(): void {
    // Escuchar cambios de clase en el html
    this.mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          this.checkDarkMode();
        }
      });
    });
    
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
      this.mutationObserver.observe(htmlElement, { attributes: true });
    }
  }

  checkDarkMode(): void {
    const htmlElement = document.querySelector('html');
    this.isDarkMode = htmlElement?.classList.contains('dark') || 
                     localStorage.getItem('theme') === 'dark' ||
                     localStorage.getItem('darkMode') === 'true';
  }

  loadAllRecipes(): void {
    this.isLoading = true;

    this.historyService.getHistory(1).subscribe({
      next: (historyItems) => {
        this.allRecipes = [];

        historyItems.forEach((item: any) => {
          const historyImageUrl = item.imageUrl || `http://localhost:3000/history/image/${item.id}`;

          console.log('🖼️ Item ID:', item.id, 'URL:', historyImageUrl);

          const recipes = item.generation?.recetas || item.generation?.recipes || [];

          if (recipes.length === 0) {
            console.warn('⚠️ No se encontraron recetas en item:', item.id);
          }

          recipes.forEach((receta: any) => {
            this.allRecipes.push({
              nombre: receta.nombre || receta.title || 'Receta sin nombre',
              descripcion: receta.descripcion || receta.description || 'Sin descripción',
              ingredientes: receta.ingredientes || receta.ingredients || [],
              instrucciones: receta.instrucciones || receta.instructions || [],
              tiempoPreparacion: receta.tiempoPreparacion ||
                receta.tiempoPreparacion ||
                (receta.prep_time_minutes ? `${receta.prep_time_minutes} minutos` : 'Tiempo no especificado'),
              historyId: item.id,
              createdAt: item.createdAt,
              imageUrl: historyImageUrl,
              isFavorite: item.isFavorite,
            });
          });
        });

        console.log('✅ Total de recetas cargadas:', this.allRecipes.length);
        console.log('📸 URLs únicas de imágenes:', [...new Set(this.allRecipes.map(r => r.imageUrl))]);

        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error cargando recetas:', error);
        this.isLoading = false;
      },
    });
  }

  applyFilters(): void {
    let result = [...this.allRecipes];

    // Aplicar búsqueda
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(
        (recipe) =>
          recipe.nombre.toLowerCase().includes(term) ||
          recipe.descripcion.toLowerCase().includes(term) ||
          recipe.ingredientes.some((ing) => ing.toLowerCase().includes(term))
      );
    }

    // Aplicar ordenamiento
    if (this.sortBy && this.sortBy.length > 0) {
      const primarySort = this.sortBy[0]; 
      
      switch (primarySort) {
        case 'newest':
          result.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        case 'oldest':
          result.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          break;
        case 'name-asc':
          result.sort((a, b) => a.nombre.localeCompare(b.nombre));
          break;
        case 'name-desc':
          result.sort((a, b) => b.nombre.localeCompare(a.nombre));
          break;
      }
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

  get totalRecipesCount(): number {
    return this.allRecipes.length;
  }

  get favoriteRecipesCount(): number {
    return this.allRecipes.filter((r) => r.isFavorite).length;
  }

  get historyCount(): number {
    return new Set(this.allRecipes.map((r) => r.historyId)).size;
  }

  get uniqueIngredientsCount(): number {
    const allIngredients = new Set<string>();
    this.allRecipes.forEach((recipe) => {
      recipe.ingredientes.forEach((ing) =>
        allIngredients.add(ing.toLowerCase())
      );
    });
    return allIngredients.size;
  }
}