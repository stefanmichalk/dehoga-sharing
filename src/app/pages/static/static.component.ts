import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { PagesService } from '../../services/pages.service';
import { Page } from '../../models/page.model';

@Component({
  selector: 'app-static',
  standalone: true,
  imports: [CommonModule, MarkdownModule],
  templateUrl: './static.component.html',
  styles: [`
    :host ::ng-deep .markdown-custom {
      & h1 {
        @apply text-3xl font-bold mt-8 mb-4;
      }
      & h2 {
        @apply text-2xl font-semibold mt-6 mb-3;
      }
      & h3 {
        @apply text-xl font-medium mt-4 mb-2;
      }
      & p {
        @apply my-4 leading-relaxed;
      }
      & ul, & ol {
        @apply my-4 ml-6;
      }
      & li {
        @apply my-2;
      }
      & a {
        @apply text-accent underline hover:text-accent/80;
      }
    }
  `]
})
export class StaticComponent implements OnInit {
  page?: Page;

  constructor(
    private route: ActivatedRoute,
    private pagesService: PagesService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadPage(params['id']);
      }
    });
  }

  private loadPage(id: string) {
    this.pagesService.getPage(id).subscribe({
      next: (page) => {
        this.page = page;
      },
      error: (error) => {
        console.error('Error loading page:', error);
      }
    });
  }
}
