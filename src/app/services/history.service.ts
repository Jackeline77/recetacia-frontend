import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface Recipe {
  nombre: string;
  descripcion: string;
  ingredientes: string[];
  instrucciones: string[];
  tiempoPreparacion: string;
}

export interface HistoryItem {
  id: number;
  generation: {
    recetas: Recipe[];
  };
  createdAt: string;
  isFavorite: boolean;
  imageUrl: string;
}

export interface PageInfo {
  totalPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private apiUrl = 'http://localhost:3000/history';

  constructor(private http: HttpClient) { }

  getHistory(page: number = 1): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?page=${page}`).pipe(
      map((response: any) => {
        // ✅ El backend devuelve un array directo, no un objeto con "items"
        console.log('📦 Respuesta del backend:', response);

        // Si es un array, usarlo directamente
        if (Array.isArray(response)) {
          return response.map(item => ({
            ...item,
            imageUrl: `${this.apiUrl}/image/${item.id}`
          }));
        }

        // Si es un objeto con propiedad "items", usar esa propiedad
        if (response && response.items) {
          return response.items.map((item: any) => ({
            ...item,
            imageUrl: `${this.apiUrl}/image/${item.id}`
          }));
        }

        // Si no hay datos, devolver array vacío
        return [];
      })
    );
  }

  getImage(historyId: number): string {
    return `${this.apiUrl}/image/${historyId}`;
  }

  getPageCount(): Observable<PageInfo> {
    return this.http.get<PageInfo>(`${this.apiUrl}/pages`);
  }

  toggleFavorite(historyId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${historyId}/favorite`, {});
  }

  deleteHistory(historyId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${historyId}`);
  }
  /*Para regenerar recetas con la misma imagen
  regenerateRecipes(historyId: number, suggestIngredients: boolean = false): Observable<any> {
    return this.http.post(`http://localhost:3000/recetacia/regenerate/${historyId}`, {
      suggestIngredients
    });
  }*/
  // Obtener solo favoritos
  getFavorites(): Observable<any[]> {
    return this.getHistory(1).pipe(
      map((items: any[]) => items.filter((item) => item.isFavorite))
    );
  }
}

/*
// services/history.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Recipe {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  preparationTime: number;
  difficulty: string;
}

export interface HistoryItem {
  id: number;
  generation: {
    recipes: Recipe[];
    analysis?: string;
  };
  createdAt: string;
  isFavorite: boolean;
  imageUrl: string;
}

export interface PageCountResponse {
  totalPages: number;
}

export interface ToggleFavoriteResponse {
  isFavorite: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private http = inject(HttpClient);
  
  private apiUrl = 'http://localhost:3000/api/history'; // Ajusta según tu backend

  getHistory(page: number = 1): Observable<HistoryItem[]> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<HistoryItem[]>(this.apiUrl, { params });
  }

  getHistoryItem(id: number): Observable<HistoryItem> {
    return this.http.get<HistoryItem>(`${this.apiUrl}/${id}`);
  }

  getPageCount(): Observable<PageCountResponse> {
    return this.http.get<PageCountResponse>(`${this.apiUrl}/pages`);
  }

  toggleFavorite(historyId: number): Observable<ToggleFavoriteResponse> {
    return this.http.patch<ToggleFavoriteResponse>(`${this.apiUrl}/${historyId}/favorite`, {});
  }

  deleteHistory(historyId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${historyId}`);
  }

  regenerateRecipes(historyId: number): Observable<any> {
    // Este endpoint deberías crearlo en tu backend si necesitas regeneración
    return this.http.post(`${this.apiUrl}/${historyId}/regenerate`, {});
  }

  getHistoryImage(historyId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/image/${historyId}`, { 
      responseType: 'blob' 
    });
  }
}*/
