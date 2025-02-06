import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestimonialService } from '../../services/testimonial.service';
import { Testimonial } from '../../interfaces/testimonial.interface';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-testimonial-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isLoading" class="text-white text-center">
      <p>Testimonials werden geladen...</p>
    </div>

    <div *ngIf="error" class="text-red-500 text-center">
      <p>{{ error }}</p>
    </div>

    <div *ngIf="currentTestimonial" class="flex flex-col md:flex-row gap-8 items-center">
      <div class="w-full md:w-1/3">
        <img 
          class="rounded-2xl bg-gray-800 object-cover shadow-2xl w-full" 
          [src]="getImageUrl(currentTestimonial.image)" 
          [alt]="currentTestimonial.autor || 'Testimonial'"
        >
      </div>
      <div class="w-full md:w-2/3">
        <blockquote class="text-xl font-semibold leading-8 text-white sm:text-2xl sm:leading-9">
          <p>{{ currentTestimonial.text }}</p>
        </blockquote>
        <div class="mt-8 text-base">
          <div class="font-semibold text-white">{{ currentTestimonial.autor }}</div>
          <div class="mt-1 text-gray-400">{{ currentTestimonial.company }}</div>
        </div>
      </div>
    </div>
  `
})
export class TestimonialWrapperComponent implements OnInit, OnDestroy {
  testimonials: Testimonial[] = [];
  currentIndex = 0;
  isLoading = true;
  error: string | null = null;
  private rotationSubscription?: Subscription;

  constructor(private testimonialService: TestimonialService) {}

  ngOnInit(): void {
    this.loadTestimonials();
  }

  ngOnDestroy(): void {
    if (this.rotationSubscription) {
      this.rotationSubscription.unsubscribe();
    }
  }

  currentTestimonial?: Testimonial;

  getImageUrl(imageId: string): string {
    return `https://dehoga-campaign.directus.app/assets/${imageId}`;
  }

  private loadTestimonials(): void {
    this.isLoading = true;
    this.error = null;
    
    this.testimonialService.getTestimonials().subscribe({
      next: (response) => {
        if (response?.data) {
          this.testimonials = Array.isArray(response.data) ? response.data : [response.data];
          console.log(this.testimonials);
          if (this.testimonials.length > 0) {
           // this.startRotation();
           this.currentIndex = 0;
           // this.currentTestimonial = this.testimonials[this.currentIndex];
          }
        } else {
          this.error = 'Keine Testimonials verfügbar';
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
}
