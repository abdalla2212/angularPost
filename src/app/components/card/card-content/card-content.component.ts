import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Post } from '../../../models/post.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-content',
  templateUrl: './card-content.component.html',
  styleUrls: ['./card-content.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class CardContentComponent {
  @Input() post!: Post;
  @Output() likeChanged = new EventEmitter<Post>();

  toggleLike(): void {
    this.post.isLiked = !this.post.isLiked;
    this.likeChanged.emit(this.post);
  }

  getFormattedDate(): string {
    const date = new Date(this.post.createdAt);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
