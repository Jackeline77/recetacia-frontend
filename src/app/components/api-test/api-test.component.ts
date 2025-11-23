import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { HistoryService } from '../../services/history.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-api-test',
  imports: [CommonModule, CardModule, ButtonModule, AccordionModule, FormsModule],
  templateUrl: './api-test.component.html',
  styleUrl: './api-test.component.css',
})
export class ApiTestComponent {
  results: any = {};
  testHistoryId = 1;
  deleteHistoryId = 1;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private historyService: HistoryService
  ) {}

  // AUTH Tests
  testRegister(): void {
    console.log('🔵 Testing POST /auth/register');
    const testUser = {
      name: 'Test User ' + Date.now(),
      email: `test${Date.now()}@example.com`,
      password: 'Password123!',
    };

    this.authService.register(testUser).subscribe({
      next: (res) => {
        this.results.register = { success: true, data: res };
        console.log('✅ Register success:', res);
      },
      error: (err) => {
        this.results.register = { success: false, data: err.error };
        console.error('❌ Register error:', err);
      },
    });
  }

  testLogin(): void {
    console.log('🔵 Testing POST /auth/login');
    this.authService
      .login({
        email: 'test@example.com',
        password: 'Password123!',
      })
      .subscribe({
        next: (res) => {
          this.results.login = { success: true, data: res };
          console.log('✅ Login success:', res);
        },
        error: (err) => {
          this.results.login = { success: false, data: err.error };
          console.error('❌ Login error:', err);
        },
      });
  }

  // PROFILE Tests
  testGetProfile(): void {
    console.log('🔵 Testing GET /profile');
    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.results.getProfile = { success: true, data: res };
        console.log('✅ Get profile success:', res);
      },
      error: (err) => {
        this.results.getProfile = { success: false, data: err.error };
        console.error('❌ Get profile error:', err);
      },
    });
  }

  testUpdateProfile(): void {
    console.log('🔵 Testing PATCH /profile');
    this.profileService
      .updateProfile({
        name: 'Updated Name ' + Date.now(),
      })
      .subscribe({
        next: (res) => {
          this.results.updateProfile = { success: true, data: res };
          console.log('✅ Update profile success:', res);
        },
        error: (err) => {
          this.results.updateProfile = { success: false, data: err.error };
          console.error('❌ Update profile error:', err);
        },
      });
  }

  // HISTORY Tests
  testGetHistory(): void {
    console.log('🔵 Testing GET /history');
    this.historyService.getHistory(1).subscribe({
      next: (res) => {
        this.results.getHistory = { success: true, data: res };
        console.log('✅ Get history success:', res);
      },
      error: (err) => {
        this.results.getHistory = { success: false, data: err.error };
        console.error('❌ Get history error:', err);
      },
    });
  }

  testGetPages(): void {
    console.log('🔵 Testing GET /history/pages');
    this.historyService.getPageCount().subscribe({
      next: (res) => {
        this.results.getPages = { success: true, data: res };
        console.log('✅ Get pages success:', res);
      },
      error: (err) => {
        this.results.getPages = { success: false, data: err.error };
        console.error('❌ Get pages error:', err);
      },
    });
  }

  testToggleFavorite(): void {
    console.log('🔵 Testing PATCH /history/:id/favorite');
    this.historyService.toggleFavorite(this.testHistoryId).subscribe({
      next: (res) => {
        this.results.toggleFavorite = { success: true, data: res };
        console.log('✅ Toggle favorite success:', res);
      },
      error: (err) => {
        this.results.toggleFavorite = { success: false, data: err.error };
        console.error('❌ Toggle favorite error:', err);
      },
    });
  }

  testDeleteHistory(): void {
    console.log('🔵 Testing DELETE /history/:id');
    this.historyService.deleteHistory(this.deleteHistoryId).subscribe({
      next: () => {
        this.results.deleteHistory = {
          success: true,
          data: { message: 'Deleted successfully' },
        };
        console.log('✅ Delete history success');
      },
      error: (err) => {
        this.results.deleteHistory = { success: false, data: err.error };
        console.error('❌ Delete history error:', err);
      },
    });
  }

  testAll(): void {
    console.log('🚀 Testing ALL endpoints...');
    this.testLogin();
    setTimeout(() => this.testGetProfile(), 1000);
    setTimeout(() => this.testGetHistory(), 2000);
    setTimeout(() => this.testGetPages(), 3000);
  }

  get successCount(): number {
    return Object.values(this.results).filter((r: any) => r.success).length;
  }

  get errorCount(): number {
    return Object.values(this.results).filter((r: any) => !r.success).length;
  }

  get testedEndpoints(): any[] {
    return Object.entries(this.results).map(([name, result]: any) => ({
      name,
      success: result.success,
    }));
  }
}
