import { Component, ViewChild, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { AnimateOnScroll } from 'primeng/animateonscroll';
import { ImageModule } from 'primeng/image';
import { RippleModule } from 'primeng/ripple';
import { animate } from 'motion';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-landing',
  imports: [
    ToolbarModule,
    AvatarModule,
    ButtonModule,
    MenubarModule,
    CommonModule,
    AnimateOnScroll,
    BadgeModule,
    InputTextModule,
    ImageModule,
    RippleModule,
    Menu,
    DialogModule,
    PanelModule,
    DividerModule,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent implements OnInit {
  isDarkMode = false;
  currentLanguage = 'es';
  items: any[] = [];

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    const element = document.querySelector('html');
    if (element !== null) {
      element.classList.toggle('dark', this.isDarkMode);
    }
  }
  ngOnInit() {
    this.buildMenu();
  }

  changeLanguage(lang: string) {
    this.currentLanguage = lang;
    this.buildMenu();
  }

  buildMenu() {
    this.items = [
      {
        label: 'Idioma',
        items: [
          {
            label: 'Español',
            icon: this.currentLanguage === 'es' ? 'pi pi-check' : '',
            command: () => this.changeLanguage('es'),
          },
          {
            label: 'English',
            icon: this.currentLanguage === 'en' ? 'pi pi-check' : '',
            command: () => this.changeLanguage('en'),
          },
        ],
      },
    ];
  }
  constructor(private router: Router, private http: HttpClient) {}

  openLogin() {
    console.log('Navegando a /login');
    this.router.navigate(['/login']);
  }

  openRegister() {
    console.log('Navegando a /register');
    this.router.navigate(['/register']);
  }
}
