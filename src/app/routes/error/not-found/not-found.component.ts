import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
@Component({
  selector: 'app-not-found',
  imports: [CommonModule, ButtonModule, CardModule],
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
