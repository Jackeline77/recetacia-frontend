import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiUrl = 'http://localhost:3000'; // Base URL

  constructor(private http: HttpClient) {}

  generateRecipes(
    imageFile: File,
    suggestIngredients: boolean
  ): Observable<any> {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('suggestIngredients', String(suggestIngredients));

    return this.http.post(
      `${this.apiUrl}/recetacia/generate-recipes`,
      formData
    );
  }
}
