import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { MessageService } from 'primeng/api';
import { HistoryService } from '../../../services/history.service';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-history-detail',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    ChipModule,
    DividerModule,
    ToastModule,
    TabViewModule,
  ],
  templateUrl: './history-detail.component.html',
  styleUrl: './history-detail.component.css'
})

export class HistoryDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private historyService = inject(HistoryService);
  private loadingService = inject(LoadingService);
  private messageService = inject(MessageService);

  historyItem: any = null;
  isLoading = true;
  currentRecipeIndex = 0;

  ngOnInit(): void {
    this.loadHistoryDetail();
  }

  loadHistoryDetail(): void {
    const historyId = this.route.snapshot.paramMap.get('id');

    if (!historyId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'ID de historial no válido'
      });
      this.router.navigate(['/dashboard/history']);
      return;
    }

    this.isLoading = true;

    // Obtener todos los items del historial y filtrar por ID
    this.historyService.getHistory(1).subscribe({
      next: (historyItems) => {
        const item = historyItems.find((item: any) => item.id === +historyId);

        if (item) {
          this.historyItem = item;
          console.log('✅ Detalle de historial cargado:', this.historyItem);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se encontró el historial solicitado'
          });
          this.router.navigate(['/dashboard/history']);
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error cargando detalle:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el detalle del historial'
        });
        this.isLoading = false;
        this.router.navigate(['/dashboard/history']);
      }
    });
  }

  // Método seguro para obtener recetas - maneja español e inglés
  getRecipes(): any[] {
    return this.historyItem?.generation?.recetas || this.historyItem?.generation?.recipes || [];
  }

  // Método seguro para obtener nombre de receta - maneja español e inglés
  getRecipeName(recipe: any): string {
    return recipe?.nombre || recipe?.title || 'Receta sin nombre';
  }

  // Método seguro para obtener descripción - maneja español e inglés
  getRecipeDescription(recipe: any): string {
    return recipe?.descripcion || recipe?.description || 'Sin descripción disponible';
  }

  // Método seguro para obtener ingredientes - maneja español e inglés
  getRecipeIngredients(recipe: any): string[] {
    return recipe?.ingredientes || recipe?.ingredients || [];
  }

  // Método seguro para obtener instrucciones - maneja español e inglés
  getRecipeInstructions(recipe: any): string[] {
    return recipe?.instrucciones || recipe?.instructions || [];
  }

  // Método seguro para obtener tiempo de preparación - maneja español e inglés
  getRecipeTime(recipe: any): string {
    return recipe?.tiempoPreparacion ||
      (recipe?.prep_time_minutes ? `${recipe.prep_time_minutes} minutos` : 'Tiempo no especificado');
  }

  goBack(): void {
    this.router.navigate(['/dashboard/history']);
  }

  toggleFavorite(): void {
    if (!this.historyItem) return;

    this.historyService.toggleFavorite(this.historyItem.id).subscribe({
      next: (updatedItem) => {
        this.historyItem.isFavorite = updatedItem.isFavorite;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: this.historyItem.isFavorite ? 'Añadido a favoritos' : 'Quitado de favoritos'
        });
      },
      error: (error) => {
        console.error('Error al actualizar favorito:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el favorito'
        });
      }
    });
  }

  // Método para imprimir la receta actual
  // Método para imprimir la receta actual
  printRecipe(): void {
    if (!this.historyItem || this.getRecipes().length === 0) return;

    const currentRecipe = this.getRecipes()[this.currentRecipeIndex];
    if (!currentRecipe) return;

    // Obtener todos los datos necesarios antes de crear el template
    const recipeName = this.getRecipeName(currentRecipe);
    const recipeDescription = this.getRecipeDescription(currentRecipe);
    const recipeTime = this.getRecipeTime(currentRecipe);
    const ingredients = this.getRecipeIngredients(currentRecipe);
    const instructions = this.getRecipeInstructions(currentRecipe);
    const generationDate = new Date(this.historyItem.createdAt).toLocaleDateString();
    const currentDate = new Date().toLocaleDateString();

    // Crear contenido HTML para imprimir
    const printContent = `
    <div class="header">
      <h1 class="recipe-title">${recipeName}</h1>
      <p class="description">${recipeDescription}</p>
      <div class="time-badge">
        ⏱️ ${recipeTime}
      </div>
    </div>

    <div class="metadata">
      <div>Generado el: ${generationDate}</div>
      <div>Recetacia - Tu asistente de cocina</div>
    </div>

    <div class="section">
      <h2 class="section-title">📋 Ingredientes</h2>
      <ul class="ingredients-list">
        ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
      </ul>
    </div>

    <div class="section">
      <h2 class="section-title">👩‍🍳 Instrucciones</h2>
      <ol class="instructions-list">
        ${instructions.map(instruction => `<li>${instruction}</li>`).join('')}
      </ol>
    </div>

    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
      Receta generada por Recetacia - ${currentDate}
    </div>
  `;

    // Crear ventana de impresión
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo abrir la ventana de impresión'
      });
      return;
    }

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${recipeName}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            line-height: 1.6;
            color: #333;
          }
          .header { 
            text-align: center; 
            border-bottom: 2px solid #4f46e5;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .recipe-title { 
            font-size: 28px; 
            color: #4f46e5;
            margin-bottom: 10px;
          }
          .description { 
            font-style: italic; 
            color: #666;
            margin-bottom: 20px;
          }
          .section { 
            margin-bottom: 25px; 
          }
          .section-title { 
            font-size: 20px; 
            color: #4f46e5;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 5px;
            margin-bottom: 15px;
          }
          .time-badge {
            background: #ede9fe;
            color: #4f46e5;
            padding: 8px 16px;
            border-radius: 20px;
            display: inline-block;
            font-weight: bold;
            margin-bottom: 20px;
          }
          .ingredients-list { 
            list-style: none; 
            padding: 0;
          }
          .ingredients-list li { 
            padding: 8px 0; 
            border-bottom: 1px solid #f3f4f6;
          }
          .instructions-list { 
            list-style: none; 
            padding: 0;
            counter-reset: step-counter;
          }
          .instructions-list li { 
            padding: 12px 0 12px 50px; 
            position: relative;
            border-bottom: 1px solid #f3f4f6;
          }
          .instructions-list li:before {
            content: counter(step-counter);
            counter-increment: step-counter;
            position: absolute;
            left: 0;
            top: 12px;
            background: #4f46e5;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
          }
          .metadata {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            font-size: 14px;
            color: #6b7280;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        ${printContent}
        <div class="no-print" style="text-align: center; margin-top: 30px;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #4f46e5; color: white; border: none; border-radius: 5px; cursor: pointer;">Imprimir</button>
          <button onclick="window.close()" style="padding: 10px 20px; background: #6b7280; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">Cerrar</button>
        </div>
        <script>
          // Auto-print
          setTimeout(() => {
            window.print();
          }, 500);
        </script>
      </body>
    </html>
  `);

    printWindow.document.close();
  }
    // Método para manejar cambio de pestaña
  onTabChange(event: any): void {
    this.currentRecipeIndex = event.index;
    console.log('📑 Cambiando a receta:', this.currentRecipeIndex);
  }
}