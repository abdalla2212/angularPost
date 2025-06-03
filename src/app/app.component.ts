import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './components/card/card.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { Post } from './models/post.model';
import { PostService } from './services/post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CardComponent, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <div class="container mt-4">
      <!-- Active Posts -->
      <div class="row mb-4">
        <div class="col-md-8 mx-auto">
          <h2>Active Posts</h2>
          <app-card
            *ngFor="let post of posts"
            [post]="post"
            (delete)="onDeletePost($event)"
            (edit)="onEditPost($event)">
          </app-card>
        </div>
      </div>

      <!-- Deleted Posts -->
      <div class="row" *ngIf="deletedPosts.length > 0">
        <div class="col-md-8 mx-auto">
          <h2>Deleted Posts</h2>
          <div class="card mb-3" *ngFor="let post of deletedPosts">
            <div class="card-body">
              <h5 class="card-title">{{ post.title }}</h5>
              <p class="card-text">{{ post.postDescription }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Restore Button -->
      <button *ngIf="deletedPosts.length > 0"
              class="floating-restore-btn"
              (click)="onRestoreAllPosts()">
        <i class="fas fa-undo"></i>
        <span>Restore All</span>
      </button>
    </div>
    <app-footer></app-footer>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .container {
      flex: 1;
    }
    .floating-restore-btn {
      position: fixed;
      bottom: 30px;
      right: 30px;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      transition: all 0.3s ease;
      z-index: 1000;
      right: 100px;
    }
    .floating-restore-btn:hover {
      background-color: #218838;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    }
    .floating-restore-btn i {
      font-size: 24px;
      margin-bottom: 4px;
    }
    .floating-restore-btn span {
      font-size: 12px;
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  deletedPosts: Post[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private postService: PostService) {}

  ngOnInit() {
    // Subscribe to posts updates
    this.subscriptions.push(
      this.postService.posts$.subscribe(posts => {
        this.posts = posts;
      })
    );

    // Subscribe to deleted posts updates
    this.subscriptions.push(
      this.postService.deletedPosts$.subscribe(posts => {
        this.deletedPosts = posts;
      })
    );
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onDeletePost(post: Post) {
    if (!post.id) {
      console.error('Cannot delete post: No ID provided');
      return;
    }

    // Add to deletedPosts array before deletion
    this.deletedPosts = [...this.deletedPosts, post];

    this.postService.deletePost(post.id).subscribe({
      error: (error) => {
        console.error('Error deleting post:', error);
      }
    });
  }

  onRestoreAllPosts() {
    // Restore all deleted posts
    this.deletedPosts.forEach(post => {
      if (post.id) {
        this.postService.createPost(post).subscribe({
          next: () => {
            // Remove from deletedPosts array after successful restore
            this.deletedPosts = this.deletedPosts.filter(p => p.id !== post.id);
          },
          error: (error) => {
            console.error('Error restoring post:', error);
          }
        });
      }
    });
  }

  onEditPost(post: Post) {
    if (!post.id) {
      console.error('Cannot edit post: No ID provided');
      return;
    }

    this.postService.updatePost(post.id, post).subscribe({
      error: (error) => {
        console.error('Error updating post:', error);
      }
    });
  }
}
