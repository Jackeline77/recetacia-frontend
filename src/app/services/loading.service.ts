import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private messageSubject = new BehaviorSubject<string>('Cargando...');

  loading$ = this.loadingSubject.asObservable();
  message$ = this.messageSubject.asObservable();

  show(message: string = 'Cargando...') {
    this.messageSubject.next(message);
    this.loadingSubject.next(true);
  }

  hide() {
    this.loadingSubject.next(false);
  }

  // Métodos específicos para navegación
  showNavigation(message: string = 'Cargando página...') {
    this.messageSubject.next(message);
    this.loadingSubject.next(true);
  }

  showData(message: string = 'Cargando datos...') {
    this.messageSubject.next(message);
    this.loadingSubject.next(true);
  }

  isLoading(): boolean {
    return this.loadingSubject.value;
  }

}