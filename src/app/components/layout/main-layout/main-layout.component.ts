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
    DrawerModule
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
      label: 'Historial',
      icon: 'pi pi-history',
      route: '/dashboard/history',
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

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Puedes cargar datos del usuario aquí
    // this.loadUserProfile();
  }

  // Ruta seleccionada por click (persistente hasta seleccionar otra)
  selectedRoute: string | null = null;

  // Selecciona la opción del menú al hacer click
  selectMenu(item: CustomMenuItem | undefined): void {
    if (!item || !item.route) return;
    this.selectedRoute = item.route;
    // Navega a la ruta (routerLink también lo hará), pero aseguramos la navegación programática
    this.router.navigate([item.route]);
    // Cerrar sidebar en caso de mobile
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