import { Component,Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-loading',
  imports: [CommonModule, ProgressSpinnerModule, SkeletonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css',
})
export class LoadingComponent {
  @Input() appName: string = 'Recetacia';
  @Input() subtitle: string = 'Tu recetario digital';
  @Input() loadingMessage: string = 'Cargando...';
}
