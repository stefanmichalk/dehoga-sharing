import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PagesService } from '../../services/pages.service';
import { Page } from '../../models/page.model';

const staticMenuItems: Page[] = [
  {
    id: 'social-media',
    title: 'Social Media',
    content: '',
    banner: null,
    footer: false,
    sort: 2
  },
  {
    id: 'downloads',
    title: 'Downloads',
    content: '',
    banner: null,
    footer: false,
    sort: 3
  }
];

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
      const dynamicMenuItems = pages.filter(page => !page.footer);
      this.menuItems = [...staticMenuItems, ...dynamicMenuItems]
        .sort((a, b) => a.sort - b.sort);
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
