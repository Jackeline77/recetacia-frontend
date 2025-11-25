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
import { DrawerModule } from 'primeng/drawer';

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
    RippleModule,
    DrawerModule,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent implements OnInit {
  sidebarVisible = false;
  userName = 'Usuario';
  userEmail = 'usuario@ejemplo.com';
  isDarkMode = false;

  // Menú principal de navegación
  menuItems: CustomMenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      route: '/dashboard',
    },
    {
      label: 'Escanear',
      icon: 'pi pi-camera',
      route: '/dashboard/generate',
    },
    {
      label: 'Historial',
      icon: 'pi pi-history',
      route: '/dashboard/history',
    },
    {
      label: 'Mis Favoritos',
      icon: 'pi pi-star-fill',
      route: '/dashboard/favorites',
    },
    {
      label: 'Mis Recetas',
      icon: 'pi pi-book',
      route: '/dashboard/recipes',
    },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  // Método para obtener las clases del icono (Desktop)
  getIconClasses(item: CustomMenuItem): string {
    const baseClasses = item.icon + ' icon-extra-large transition-colors duration-300';
    
    if (this.isSelected(item)) {
      return baseClasses + ' text-white';
    } else {
      return baseClasses + (this.isDarkMode ? ' text-gray-300' : ' text-primary-800');
    }
  }

  // Método para obtener las clases del icono (Mobile)
  getMobileIconClasses(item: CustomMenuItem): string {
    const baseClasses = item.icon + ' text-lg transition-colors duration-300';
    
    if (this.isSelected(item)) {
      return baseClasses + (this.isDarkMode ? ' text-white' : ' text-amber-900');
    } else {
      return baseClasses + (this.isDarkMode ? ' text-gray-400' : ' text-amber-700');
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    // Guardar preferencia en localStorage
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme();
  }

  // ✅ Método para aplicar el tema actual
  private applyTheme(): void {
    const element = document.querySelector('html');
    if (element !== null) {
      if (this.isDarkMode) {
        element.classList.add('dark');
      } else {
        element.classList.remove('dark');
      }
    }
  }

  selectedRoute: string | null = null;

  selectMenu(item: CustomMenuItem | undefined): void {
    if (!item || !item.route) return;
    this.selectedRoute = item.route;
    this.router.navigate([item.route]);
    this.sidebarVisible = false;
  }

  isActiveRoute(route: string | undefined): boolean {
    if (!route) return false;
    return this.router.url === route || this.router.url.includes(route);
  }

  // Comprueba si un item está actualmente seleccionado (por click) o activo por la ruta
  isSelected(item: CustomMenuItem | undefined): boolean {
    if (!item) return false;
    if (this.selectedRoute) return this.selectedRoute === item.route;
    return this.isActiveRoute(item.route);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/landing']);
  }
}
