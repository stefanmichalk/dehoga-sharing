import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PagesService } from '../../services/pages.service';
import { Page } from '../../models/page.model';
import { CookieSettingsComponent } from '../cookie-settings/cookie-settings.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, CookieSettingsComponent],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  footerPages: Page[] = [];

  constructor(private pagesService: PagesService) {}

  ngOnInit() {
    this.loadFooterPages();
  }

  private loadFooterPages() {
    this.pagesService.getPages().subscribe(pages => {
      this.footerPages = pages.filter(page => page.footer);
    });
  }
}
