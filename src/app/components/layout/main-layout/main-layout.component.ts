import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { MenuItem } from 'primeng/api';

interface CustomMenuItem extends MenuItem {
  route?: string;
  badge?: string;
}

@Component({
  selector: 'app-main-layout',
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    SidebarModule,
    ButtonModule,
    AvatarModule,
    MenuModule,
    BadgeModule,
    RippleModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit {
  sidebarVisible = false;
  userName = 'Usuario';
  userEmail = 'usuario@ejemplo.com';

  // Menú principal de navegación
  menuItems: CustomMenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      route: '/dashboard'
    },
    {
      label: 'Generar Recetas',
      icon: 'pi pi-sparkles',
      route: '/dashboard/generate'
    },
    {
      label: 'Historial',
      icon: 'pi pi-history',
      route: '/dashboard/history',
      badge: '3'
    },
    {
      label: 'Mis Favoritos',
      icon: 'pi pi-star-fill',
      route: '/dashboard/favorites'
    },
    {
      label: 'Mis Recetas',
      icon: 'pi pi-book',
      route: '/dashboard/recipes'
    }
  ];

  // Menú de usuario (configuración, perfil, etc.)
  userMenuItems: CustomMenuItem[] = [
    {
      label: 'Configuración',
      icon: 'pi pi-cog',
      route: '/dashboard/settings'
    },
    {
      label: 'Perfil',
      icon: 'pi pi-user',
      route: '/dashboard/profile'
    },
    {
      label: 'Ayuda',
      icon: 'pi pi-question-circle',
      route: '/dashboard/help'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Puedes cargar datos del usuario aquí
    // this.loadUserProfile();
  }

  isActiveRoute(route: string | undefined): boolean {
    if (!route) return false;
    return this.router.url === route || this.router.url.includes(route);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/landing']);
  }
}