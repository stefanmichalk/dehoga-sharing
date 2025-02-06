import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { TestimonialService } from '../../services/testimonial.service';
import { Testimonial } from '../../interfaces/testimonial.interface';

@Component({
  selector: 'app-testimonial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.scss'],

})
export class TestimonialComponent implements OnInit, AfterViewInit {
  isLoading = true;
  error: string | null = null;
  allTestimonials: Testimonial[] = [];
  currentIndex = 0;
  currentTranslateX = 0;

  @ViewChild('sliderContainer') sliderContainer!: ElementRef;

  constructor(private testimonialService: TestimonialService) {}

  ngOnInit(): void {
    this.loadTestimonial();
  }

  private loadTestimonial(): void {
    this.isLoading = true;
    this.error = null;
    
    this.testimonialService.getTestimonials().subscribe({
      next: (response) => {
        if (response && Array.isArray(response.data) && response.data.length > 0) {
          const data = response.data;
          // shuffle data
          for (let i = data.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [data[i], data[j]] = [data[j], data[i]];
          }
          this.allTestimonials = data;
        } else {
          this.error = 'Kein Testimonial verfügbar';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Fehler beim Laden der Testimonials';
        this.isLoading = false;
        console.error('Error loading testimonials:', error);
      }
    });
  }

  getImageUrl(imageId: string): string {
    return `https://dehoga-campaign.directus.app/assets/${imageId}`;
  }

  ngAfterViewInit() {
    // Hide scrollbar but keep functionality
    const style = document.createElement('style');
    style.textContent = `
      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);
  }

  goToTestimonial(index: number): void {
    if (index >= 0 && index < this.allTestimonials.length) {
      const container = this.sliderContainer.nativeElement;
      const slideWidth = container.offsetWidth;
      container.scrollTo({
        left: slideWidth * index,
        behavior: 'smooth'
      });
      this.currentIndex = index;
    }
  }

  onScroll(): void {
    const container = this.sliderContainer.nativeElement;
    const slideWidth = container.offsetWidth;
    const scrollLeft = container.scrollLeft;
    
    this.currentTranslateX = scrollLeft;
    this.currentIndex = Math.round(scrollLeft / slideWidth);
  }
} 
