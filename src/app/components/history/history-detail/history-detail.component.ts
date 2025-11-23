import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HistoryService, HistoryItem, Recipe } from '../../../services/history.service';
import { LoadingService } from '../../../services/loading.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'app-history-detail',
  imports: [CommonModule,
    CardModule,
    ButtonModule,
    TabViewModule,
    DividerModule,
    ChipModule],
  templateUrl: './history-detail.component.html',
  styleUrl: './history-detail.component.css'
})
export class HistoryDetailComponent implements OnInit {
  historyItem: HistoryItem | null = null;
  historyId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private historyService: HistoryService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.historyId = +params['id'];
      this.loadHistoryItem();
    });
  }

  loadHistoryItem(): void {
    // Como el endpoint actual no tiene detalle individual, 
    // cargamos toda la página y filtramos
    this.historyService.getHistory(1).subscribe({
      next: (data) => {
        const item = data.find(h => h.id === this.historyId);
        if (item) {
          this.historyItem = item;
        } else {
          this.router.navigate(['/dashboard/history']);
        }
      },
      error: () => {
        this.router.navigate(['/dashboard/history']);
      }
    });
  }

  toggleFavorite(): void {
    if (!this.historyItem) return;

    this.historyService.toggleFavorite(this.historyId).subscribe({
      next: () => {
        if (this.historyItem) {
          this.historyItem.isFavorite = !this.historyItem.isFavorite;
        }
      }
    });
  }

  regenerate(): void {
    this.loadingService.show('Regenerando recetas...');
    this.historyService.regenerateRecipes(this.historyId).subscribe({
      next: () => {
        this.loadingService.hide();
        this.loadHistoryItem();
      },
      error: () => {
        this.loadingService.hide();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/history']);
  }
}