import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() hasDeletedPosts = false;
  @Input() onRestoreAll: () => void = () => {};
  @Input() onAddPost: () => void = () => {};
}
