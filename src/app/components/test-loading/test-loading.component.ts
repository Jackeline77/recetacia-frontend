import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../../services/loading.service';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-test-loading',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './test-loading.component.html',
  styleUrl: './test-loading.component.css',
})
export class TestLoadingComponent {
  isLoading$: Observable<boolean>;
  message$: Observable<string>;

  constructor(
    private loadingService: LoadingService,
    private http: HttpClient
  ) {
    this.isLoading$ = this.loadingService.loading$;
    this.message$ = this.loadingService.message$;
  }

  // Test manual del loading
  testDirecto() {
    console.log('🔧 TEST DIRECTO: Activando loading manualmente');
    this.loadingService.show('TEST DIRECTO - ¿Me ves?');

    setTimeout(() => {
      this.loadingService.hide();
      console.log('🔧 TEST DIRECTO: Loading ocultado');
    }, 500);
  }  
}
