import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { finalize, tap } from 'rxjs/operators';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  // Ignorar peticiones de assets y PrimeNG
  if (req.url.includes('assets/') || req.url.includes('primeng/')) {
    return next(req);
  }

  let showLoading = false;
  const loadingTimer = setTimeout(() => {
    showLoading = true;
    loadingService.show('Cargando datos...');
  }, 300);

  return next(req).pipe(
    tap({
      next: () => {
        if (showLoading) {
          clearTimeout(loadingTimer);
        }
      },
      error: () => {
        if (showLoading) {
          clearTimeout(loadingTimer);
        }
      }
    }),
    finalize(() => {
      clearTimeout(loadingTimer);
      if (showLoading) {
        setTimeout(() => loadingService.hide(), 100);
      }
    })
  );
};