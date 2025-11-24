import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-auth-image',
  imports: [CommonModule],
  templateUrl: './auth-image.component.html',
  styleUrl: './auth-image.component.css'
})
export class AuthImageComponent implements OnInit {
  @Input() src!: string;
  @Input() alt: string = 'Image';
  @Input() imageClass: string = '';

  imageUrl: SafeUrl | null = null;
  loading = true;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    if (this.src) {
      this.loadImage();
    }
  }

  loadImage(): void {
    this.loading = true;

    // Hacer petición con el token incluido automáticamente por el interceptor
    this.http.get(this.src, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const objectUrl = URL.createObjectURL(blob);
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando imagen:', error);
        this.loading = false;
      }
    });
  }
}