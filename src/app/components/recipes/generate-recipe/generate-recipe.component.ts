import { Component, ElementRef, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../../../services/recipe.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-generate-recipe',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule],
  providers: [MessageService],
  templateUrl: './generate-recipe.component.html',
  styles: [],
})
export class GenerateRecipeComponent implements OnInit, OnDestroy {
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasElement!: ElementRef<HTMLCanvasElement>;

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  suggestIngredients: boolean = false;
  isLoading: boolean = false;
  isProcessingCapture: boolean = false;
  isDragging: boolean = false;
  isCameraOpen: boolean = false;
  isDarkMode: boolean = false;
  stream: MediaStream | null = null;
  private mutationObserver?: MutationObserver;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.checkDarkMode();
    this.setupThemeListener();
  }

  ngOnDestroy() {
    this.stopCamera();
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }

  setupThemeListener(): void {
    // Escuchar cambios de clase en el html
    this.mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          this.checkDarkMode();
        }
      });
    });
    
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
      this.mutationObserver.observe(htmlElement, { attributes: true });
    }
  }

  checkDarkMode(): void {
    const htmlElement = document.querySelector('html');
    this.isDarkMode = htmlElement?.classList.contains('dark') || 
                     localStorage.getItem('theme') === 'dark' ||
                     localStorage.getItem('darkMode') === 'true';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) this.processFile(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files.length) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  processFile(file: File, onComplete?: () => void) {
    if (file && file.type.match(/image\/*/) !== null) {
      if (file.size > 5 * 1024 * 1024) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'La imagen no debe superar los 5MB',
        });
        if (onComplete) onComplete();
        return;
      }

      this.selectedFile = file;
      const reader = new FileReader();

      reader.onload = (e) => {
        this.imagePreview = reader.result as string;
        if (onComplete) onComplete();
      };

      reader.readAsDataURL(file);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor selecciona un archivo de imagen válido',
      });
      if (onComplete) onComplete();
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.stopCamera();
  }

  async startCamera() {
    this.imagePreview = null;
    this.selectedFile = null;
    this.isCameraOpen = true;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      setTimeout(() => {
        if (this.videoElement && this.videoElement.nativeElement) {
          this.videoElement.nativeElement.srcObject = this.stream;
          this.videoElement.nativeElement.play();
        }
      }, 50);
    } catch (err) {
      console.error(err);
      this.isCameraOpen = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo acceder a la cámara.',
      });
    }
  }

  capturePhoto() {
    if (!this.videoElement || !this.canvasElement) return;

    this.isProcessingCapture = true;

    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;

    video.pause();

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], 'camera-capture.jpg', {
            type: 'image/jpeg',
          });

          this.processFile(file, () => {
            this.stopCamera();
            this.isProcessingCapture = false;
          });
        } else {
          this.isProcessingCapture = false;
          video.play();
        }
      },
      'image/jpeg',
      0.95
    );
  }

  stopCamera() {
    this.isCameraOpen = false;
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  generate() {
    if (!this.selectedFile) return;

    this.isLoading = true;

    this.recipeService
      .generateRecipes(this.selectedFile, this.suggestIngredients)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Recetas generadas correctamente',
          });

          setTimeout(() => {
            this.router.navigate(['/dashboard/history']);
          }, 1500);
        },
        error: (error) => {
          this.isLoading = false;
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Falló la generación de recetas',
          });
        },
      });
  }
}