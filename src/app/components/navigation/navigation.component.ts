import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { PagesService } from '../../services/pages.service';
import { Page } from '../../models/page.model';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  menuItems: { path: string, label: string }[] = [];
  mobileMenuOpen = false;
  currentId: string = '';

  constructor(
    private pagesService: PagesService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.currentId = params['id'];
    });
  }

  ngOnInit() {
    this.loadMenuItems();
  }

  isActive(path: string): boolean {
    const id = path.split('/').pop();
    return id === this.currentId;
  }

  private loadMenuItems() {
    this.pagesService.getPages().subscribe({
      next: (pages) => {
        this.menuItems = pages
          .filter(page => !page.footer)
          .map(page => ({
            path: `/page/${page.id}`,
            label: page.title
          }));
      },
      error: (error) => {
        console.error('Error loading menu items:', error);
      }
    });
  }
}
