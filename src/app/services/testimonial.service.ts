import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Testimonial } from '../interfaces/testimonial.interface';

@Injectable({
  providedIn: 'root'
})
export class TestimonialService {
  private readonly API_URL = 'https://dehoga-campaign.directus.app/items/testimonial';

  constructor(private http: HttpClient) {}

  getTestimonials(): Observable<{ data: Testimonial[] }> {
    return this.http.get<{ data: Testimonial[] }>(this.API_URL, {
      params: {
      }
    });
  }
}
