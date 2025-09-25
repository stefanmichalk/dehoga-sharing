import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seven-percent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seven-percent.component.html',
  styleUrl: './seven-percent.component.scss'
})
export class SevenPercentComponent {
  
  downloadImage(imagePath: string, fileName: string) {
    const link = document.createElement('a');
    link.href = imagePath;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
