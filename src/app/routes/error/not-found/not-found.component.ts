import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ImageCompareModule } from 'primeng/imagecompare';

@Component({
  selector: 'app-not-found',
  imports: [CommonModule, ButtonModule, CardModule,ImageCompareModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/landing']);
  }

  goBack(): void {
    window.history.back();
  }
}
