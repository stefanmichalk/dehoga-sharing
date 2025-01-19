import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlocksComponent } from './blocks.component';
import { Block } from '../../models/block.interface';
import { BlockService } from '../../services/block.service';

@Component({
  selector: 'app-blocks-container',
  standalone: true,
  imports: [CommonModule, BlocksComponent],
  template: `
    <div class="blocks-container">
      <ng-container *ngFor="let block of filteredBlocks">
        <app-blocks [block]="block"></app-blocks>
      </ng-container>
    </div>
  `,
  styles: [`
    .blocks-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
  `]
})
export class BlocksContainerComponent implements OnChanges {
  @Input() blocks: Block[] = [];
  @Input() relatedPage: string = '';

  constructor(private blockService: BlockService) {}

  ngOnChanges(changes: SimpleChanges) {

  }

  get filteredBlocks(): Block[] {
    const filtered = this.blocks.filter(block =>
      block.relatedPage === this.relatedPage &&
      block.status === 'published'
    ).sort((a, b) => (a.sort || 0) - (b.sort || 0));

    return filtered;
  }
}
