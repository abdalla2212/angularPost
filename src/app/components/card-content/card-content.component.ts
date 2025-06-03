import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Post } from '../../models/post.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-2">
          <img [src]="post.userImage" class="rounded-circle" style="width: 40px; height: 40px; object-fit: cover;">
          <div>
            <h6 class="mb-0">{{ post.userName }}</h6>
            <small class="text-muted">{{ post.createdAt | date:'medium' }}</small>
          </div>
        </div>
        <div class="dropdown">
          <button class="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-three-dots-vertical"></i>
          </button>
          <ul class="dropdown-menu">
            <li><button class="dropdown-item" (click)="onEdit()"><i class="bi bi-pencil me-2"></i>Edit</button></li>
            <li><button class="dropdown-item text-danger" (click)="onDelete()"><i class="bi bi-trash me-2"></i>Delete</button></li>
          </ul>
        </div>
      </div>
      <img [src]="post.postImage" class="card-img-top" style="height: 300px; object-fit: cover;">
      <div class="card-body">
        <h5 class="card-title">{{ post.title }}</h5>
        <p class="card-text">{{ post.postDescription }}</p>
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex gap-3">
            <button class="btn" (click)="toggleLike()">
              <i class="bi" [class.bi-heart]="!post.isLiked" [class.bi-heart-fill]="post.isLiked" [class.text-danger]="post.isLiked"></i>
              {{ post.isLiked ? 'Liked' : 'Like' }}
            </button>
            <button class="btn" (click)="toggleComments()">
              <i class="bi bi-chat"></i>
              Comments
            </button>
          </div>
        </div>

        <!-- Comments Section -->
        <div class="comments-section mt-3" *ngIf="showComments">
          <div class="comments-list mb-3">
            <div *ngFor="let comment of comments" class="comment mb-2">
              <div class="d-flex align-items-center gap-2">
                <img [src]="comment.userImage" class="rounded-circle" style="width: 30px; height: 30px; object-fit: cover;">
                <div>
                  <h6 class="mb-0">{{ comment.userName }}</h6>
                  <p class="mb-0">{{ comment.text }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="add-comment">
            <div class="input-group">
              <input type="text" class="form-control" placeholder="Add a comment..." [(ngModel)]="newComment">
              <button class="btn btn-primary" (click)="addComment()">Post</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: none;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 1rem;
    }
    .card-header {
      background-color: white;
      border-bottom: 1px solid #eee;
    }
    .btn {
      padding: 0.25rem 0.5rem;
    }
    .btn i {
      font-size: 1.2rem;
    }
    .comments-section {
      border-top: 1px solid #eee;
      padding-top: 1rem;
    }
    .comment {
      padding: 0.5rem;
      border-radius: 4px;
    }
    .comment:hover {
      background-color: #f8f9fa;
    }
  `]
})
export class CardContentComponent {
  @Input() post!: Post;
  @Output() delete = new EventEmitter<Post>();
  @Output() edit = new EventEmitter<Post>();
  showComments = false;
  comments: { userName: string; userImage: string; text: string }[] = [];
  newComment = '';

  toggleLike() {
    this.post.isLiked = !this.post.isLiked;
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }

  addComment() {
    if (this.newComment.trim()) {
      this.comments.push({
        userName: 'Current User',
        userImage: 'https://via.placeholder.com/30',
        text: this.newComment
      });
      this.newComment = '';
    }
  }

  onDelete() {
    this.delete.emit(this.post);
  }

  onEdit() {
    this.edit.emit(this.post);
  }
}
