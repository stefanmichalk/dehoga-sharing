import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlocksComponent } from '../../components/blocks/blocks.component';
import { BlocksContainerComponent } from '../../components/blocks/blocks-container.component';
import { TestimonialComponent } from '../../components/testimonial/testimonial.component';
import { TestimonialWrapperComponent } from '../../components/testimonial-wrapper/testimonial-wrapper.component';

import { Block } from '../../models/block.interface';
import { BlockService } from '../../services/block.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BlocksComponent, BlocksContainerComponent, TestimonialComponent, TestimonialWrapperComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  blocks: Block[] = [];
  parallaxOffset = 0;
  private ticking = false;
  private scrollY = 0;

  constructor(private blockService: BlockService) {}

  ngOnInit() {
    this.loadBlocks();
    // Safely access window during client-side execution
    if (typeof window !== 'undefined') {
      this.scrollY = window.scrollY;
    }
  }

  ngOnDestroy() {
    // Cleanup
    this.ticking = false;
  }

  @HostListener('window:scroll')
  onScroll() {
    if (typeof window !== 'undefined') {
      this.scrollY = window.scrollY;
      this.requestTick();
    }
  }

  private requestTick() {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.updateParallax();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  private updateParallax() {
    if (typeof window !== 'undefined') {
      // Parallax effect: Move background at half the scroll speed
      this.parallaxOffset = this.scrollY * 0.5;
    }
  }

  private loadBlocks() {
    this.blockService.getBlocks().subscribe({
      next: (blocks) => {
        this.blocks = blocks;
        // Log the blocks that will be passed to the component
      },
      error: (error) => {
        console.error('Error loading blocks:', error);
      }
    });
  }
}
