import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-md-8 mx-auto">
          <div class="card mb-4" *ngFor="let post of posts">
            <div class="card-body">
              <h5 class="card-title">{{ post.title }}</h5>
              <p class="card-text">{{ post.postDescription }}</p>
              <img [src]="post.postImage" class="img-fluid mb-3" *ngIf="post.postImage">
              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">Posted by {{ post.userName }}</small>
                <div class="action-buttons">
                  <button class="btn btn-primary me-2" (click)="editPost(post)">
                    <i class="bi bi-pencil"></i> Edit
                  </button>
                  <button class="btn btn-danger" (click)="deletePost(post)">
                    <i class="bi bi-trash"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      transition: all 0.2s;
    }
    .btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .btn-primary {
      background-color: #0d6efd;
      border-color: #0d6efd;
    }
    .btn-primary:hover {
      background-color: #0b5ed7;
      border-color: #0a58ca;
    }
    .btn-danger {
      background-color: #dc3545;
      border-color: #dc3545;
    }
    .btn-danger:hover {
      background-color: #bb2d3b;
      border-color: #b02a37;
    }
  `]
})
export class PostComponent implements OnInit {
  posts: Post[] = [];
  newPost: Post = {
    title: '',
    postDescription: '',
    postImage: '',
    userName: '',
    userImage: '',
    createdAt: '',
    isLiked: false,
    comments: []
  };

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getPosts().subscribe({
      next: (posts) => {
        console.log('Posts loaded:', posts);
        this.posts = posts;
      },
      error: (error) => {
        console.error('Error loading posts:', error);
      }
    });
  }

  onSubmit() {
    this.postService.createPost(this.newPost);
    this.newPost = {
      title: '',
      postDescription: '',
      postImage: '',
      userName: '',
      userImage: '',
      createdAt: '',
      isLiked: false,
      comments: []
    };
  }

  editPost(post: Post) {
    console.log('Edit post:', post);
  }

  deletePost(post: Post) {
    if (post.id) {
      this.postService.deletePost(post.id).subscribe({
        next: () => {
          console.log('Post deleted successfully');
          this.posts = this.posts.filter(p => p.id !== post.id);
        },
        error: (error) => {
          console.error('Error deleting post:', error);
        }
      });
    }
  }
}
