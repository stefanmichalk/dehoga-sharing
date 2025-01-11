import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareButtonsComponent } from '../share-buttons/share-buttons.component';

@Component({
  selector: 'app-share-modal',
  standalone: true,
  imports: [CommonModule, ShareButtonsComponent],
  template: `
    <div *ngIf="show" 
         class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
         [style.transition]="'opacity 0.2s ease-in-out'"
         (click)="close()">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 transform transition-transform duration-200"
           [class.translate-y-0]="show"
           [class.translate-y-4]="!show"
           (click)="$event.stopPropagation()">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-gray-900">Teilen</h2>
            <button (click)="close()" 
                    class="text-gray-400 hover:text-gray-500 transition-colors">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <p class="text-sm text-gray-600 mb-6">
            Teile diesen Beitrag über deine bevorzugten Kanäle
          </p>

          <app-share-buttons 
            [cardId]="cardId"
            [title]="title">
          </app-share-buttons>
        </div>
      </div>
    </div>
  `
})
export class ShareModalComponent {
  @Input() cardId!: string;
  @Input() title!: string;
  @Input() show = false;
  @Output() showChange = new EventEmitter<boolean>();

  close() {
    this.show = false;
    this.showChange.emit(false);
  }
}
