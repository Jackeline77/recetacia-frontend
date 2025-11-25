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

        console.log('📦 Respuesta del backend:', response);

        // Si es un array, usarlo directamente
        if (Array.isArray(response)) {
          return response.map(item => ({
            ...item,
            imageUrl: `${this.apiUrl}/image/${item.id}`
          }));
        }

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
  // Obtener solo favoritos
  getFavorites(): Observable<any[]> {
    return this.getHistory(1).pipe(
      map((items: any[]) => items.filter((item) => item.isFavorite))
    );
  }
}