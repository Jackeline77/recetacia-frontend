import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from '../../services/loading.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css',
})
export class LoadingComponent {
  @Input() type: 'fullscreen' | 'overlay' | 'inline' = 'overlay';
  @Input() message: string = 'Cargando...';
  @Input() useService: boolean = false;

  isLoading$: Observable<boolean>;
  serviceMessage$: Observable<string>;

  constructor(private loadingService: LoadingService) {
    this.isLoading$ = this.loadingService.loading$;
    this.serviceMessage$ = this.loadingService.message$;
  }
}
