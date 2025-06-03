import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Post } from '../models/post.model';
import { switchMap, map, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:3000/posts';

  private postsSubject = new BehaviorSubject<Post[]>([]);
  private deletedPostsSubject = new BehaviorSubject<Post[]>([]);

  posts$ = this.postsSubject.asObservable();
  deletedPosts$ = this.deletedPostsSubject.asObservable();

  constructor(private http: HttpClient) {
    // Load initial data
    this.loadInitialData();
  }

  private loadInitialData() {
    // Load active posts from API
    this.http.get<Post[]>(this.apiUrl).subscribe(posts => {
      this.postsSubject.next(posts);
    });
  }

  // Get all posts
  getPosts(): Observable<Post[]> {
    return this.posts$;
  }

  // Get all deleted posts
  getDeletedPosts(): Observable<Post[]> {
    return this.deletedPosts$;
  }

  // Get a single post
  getPost(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  // Create a new post
  createPost(post: Post): Observable<Post> {
    const newPost = {
      ...post,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    return this.http.post<Post>(this.apiUrl, newPost).pipe(
      tap(createdPost => {
        const currentPosts = this.postsSubject.value;
        this.postsSubject.next([...currentPosts, createdPost]);
      })
    );
  }

  // Update a post
  updatePost(id: string, post: Post): Observable<Post> {
    const updatedPost = {
      ...post,
      id: id,
      createdAt: post.createdAt || new Date().toISOString()
    };

    return this.http.put<Post>(`${this.apiUrl}/${id}`, updatedPost).pipe(
      tap(updatedPost => {
        const currentPosts = this.postsSubject.value;
        const index = currentPosts.findIndex(p => p.id === id);
        if (index !== -1) {
          currentPosts[index] = updatedPost;
          this.postsSubject.next([...currentPosts]);
        }
      })
    );
  }

  // Delete a post permanently
  deletePost(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        // Update posts subject
        const currentPosts = this.postsSubject.value;
        this.postsSubject.next(currentPosts.filter(p => p.id !== id.toString()));
      })
    );
  }

  // Add a comment to a post
  addComment(postId: string, comment: string): Observable<Post> {
    return this.getPost(postId).pipe(
      switchMap(post => {
        const updatedPost = {
          ...post,
          comments: [...post.comments, comment]
        };
        return this.updatePost(postId, updatedPost);
      })
    );
  }

  // Toggle like status
  toggleLike(postId: string): Observable<Post> {
    return this.getPost(postId).pipe(
      switchMap(post => {
        const updatedPost = {
          ...post,
          isLiked: !post.isLiked
        };
        return this.updatePost(postId, updatedPost);
      })
    );
  }
}
