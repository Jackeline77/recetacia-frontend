// src/app/services/profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface UpdateProfileDto {
  name?: string;
  email?: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:3000/profile';

  constructor(private http: HttpClient) { }

  // GET /profile - Obtener perfil del usuario
  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.apiUrl).pipe(
      tap(profile => console.log(' Profile loaded:', profile))
    );
  }

  // PATCH /profile - Actualizar perfil
  updateProfile(data: UpdateProfileDto): Observable<UserProfile> {
    return this.http.patch<UserProfile>(this.apiUrl, data).pipe(
      tap(profile => console.log(' Profile updated:', profile))
    );
  }

  // DELETE /profile - Eliminar cuenta
  deleteProfile(): Observable<void> {
    return this.http.delete<void>(this.apiUrl).pipe(
      tap(() => console.log(' Profile deleted'))
    );
  }
}