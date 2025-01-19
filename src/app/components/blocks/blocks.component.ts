import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { Block } from '../../models/block.interface';
import { BlockService } from '../../services/block.service';

@Component({
  selector: 'app-blocks',
  standalone: true,
  imports: [CommonModule, MarkdownModule],
  templateUrl: './blocks.component.html'
})
export class BlocksComponent {
  @Input() block!: Block;

  constructor(private blockService: BlockService) {}

  getImageUrl(image: string): string {
    return this.blockService.getImageUrl(image);
  }
}
