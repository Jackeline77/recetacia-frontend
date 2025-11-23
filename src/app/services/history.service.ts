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
}