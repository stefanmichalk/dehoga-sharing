import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PagesService } from '../../services/pages.service';
import { Page } from '../../models/page.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  menuItems: Page[] = [];
  mobileMenuOpen = false;

  constructor(
    private pagesService: PagesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.pagesService.getPages().subscribe(pages => {
      this.menuItems = pages.filter(page => !page.footer);
    });
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  // Methode für Scroll-Animation
  scrollToContent() {
    const element = document.querySelector('#content');
    element?.scrollIntoView({ behavior: 'smooth' });
  }
}
