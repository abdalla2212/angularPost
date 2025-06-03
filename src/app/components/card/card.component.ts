import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';
import { UserDataComponent } from './user-data/user-data.component';
import { CardContentComponent } from './card-content/card-content.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { storage } from '../../firebase.config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  standalone: true,
  imports: [UserDataComponent, CardContentComponent, CommonModule, FormsModule]
})
export class CardComponent implements OnInit {
  @Input() post!: Post;
  @Output() delete = new EventEmitter<Post>();
  @Output() edit = new EventEmitter<Post>();
  @Output() newPostAdded = new EventEmitter<Post>();

  showEditForm = false;
  showAddForm = false;
  showCommentForm = false;
  newComment: string = '';
  isDescriptionExpanded = false;
  maxDescriptionLength = 150;
  editedPost: Post = {
    id: '',
    userName: '',
    userImage: '',
    title: '',
    postDescription: '',
    postImage: '',
    createdAt: new Date().toISOString(),
    isLiked: false,
    comments: []
  };
  selectedProfileFile: File | null = null;
  selectedEditProfileFile: File | null = null;
  profilePreviewUrl: string | null = null;
  editProfilePreviewUrl: string | null = null;
  previewUrl: string | null = null;
  editPreviewUrl: string | null = null;
  isUploading = false;

  newPost: Post = {
    id: '',
    userName: '',
    userImage: '',
    title: '',
    postDescription: '',
    postImage: '',
    createdAt: new Date().toISOString(),
    isLiked: false,
    comments: []
  };

  constructor(
    private postService: PostService
  ) {}

  ngOnInit() {
    if (this.post && !this.post.id) {
      this.post.id = Date.now().toString();
    }
    this.editedPost = { ...this.post };
  }

  private async compressImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Failed to compress image'));
            }
          }, 'image/jpeg', 0.7);
        };
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
    });
  }

  async onProfileImageSelected(event: Event, isEdit: boolean = false) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      this.isUploading = true;
      try {
        // Compress image before upload
        const compressedFile = await this.compressImage(file);

        // Create a unique file name
        const fileName = `profile_${Date.now()}_${file.name}`;
        const storageRef = ref(storage, `profile_images/${fileName}`);

        // Upload the compressed file
        const snapshot = await uploadBytes(storageRef, compressedFile);

        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        if (isEdit) {
          this.editedPost.userImage = downloadURL;
          this.editProfilePreviewUrl = downloadURL;
        } else {
          this.newPost.userImage = downloadURL;
          this.profilePreviewUrl = downloadURL;
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
      } finally {
        this.isUploading = false;
      }
    }
  }

  getImageUrl(path: string | undefined): string {
    if (!path) return '';

    // If it's a full URL, return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    // If it's a local asset, ensure it starts with assets/
    if (!path.startsWith('assets/')) {
      path = `assets/${path}`;
    }

    return path;
  }

  onProfileImageUrlChange(event: Event, isEdit: boolean = false) {
    const input = event.target as HTMLInputElement;
    const url = input.value;
    const fixedUrl = this.getImageUrl(url);
    if (isEdit) {
      this.editedPost.userImage = fixedUrl;
      this.editProfilePreviewUrl = fixedUrl;
    } else {
      this.newPost.userImage = fixedUrl;
      this.profilePreviewUrl = fixedUrl;
    }
  }

  onPostImageUrlChange(event: Event, isEdit: boolean = false) {
    const input = event.target as HTMLInputElement;
    const url = input.value;
    const fixedUrl = this.getImageUrl(url);
    if (isEdit) {
      this.editedPost.postImage = fixedUrl;
      this.editPreviewUrl = fixedUrl;
    } else {
      this.newPost.postImage = fixedUrl;
      this.previewUrl = fixedUrl;
    }
  }

  onclicklike() {
    if (this.post.id) {
      this.postService.toggleLike(this.post.id).subscribe({
        next: (updatedPost) => {
          console.log('Post liked:', updatedPost);
          this.post = updatedPost;
        },
        error: (error) => {
          console.error('Error liking post:', error);
        }
      });
    }
  }

  onDelete() {
    if (!this.post.id) {
      this.post.id = Date.now().toString();
    }

    this.delete.emit(this.post);
    this.postService.deletePost(this.post.id).subscribe({
      next: () => {
        console.log('Post deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting post:', error);
      }
    });
  }

  onEdit() {
    this.showEditForm = true;
    this.editedPost = { ...this.post };
    this.editProfilePreviewUrl = this.post.userImage;
  }

  saveEdit() {
    if (this.post.id) {
      this.postService.updatePost(this.post.id, this.editedPost).subscribe({
        next: (updatedPost) => {
          console.log('Post updated:', updatedPost);
          this.post = updatedPost;
          this.edit.emit(updatedPost);
          this.showEditForm = false;
          this.resetEditForm();
        },
        error: (error) => {
          console.error('Error updating post:', error);
        }
      });
    }
  }

  cancelEdit() {
    this.showEditForm = false;
    this.editedPost = { ...this.post };
    this.resetEditForm();
  }

  showCommentModal() {
    this.showCommentForm = !this.showCommentForm;
    if (!this.showCommentForm) {
      this.newComment = '';
    }
  }

  addComment() {
    if (this.newComment.trim() && this.post.id) {
      this.postService.addComment(this.post.id, this.newComment).subscribe({
        next: (updatedPost) => {
          console.log('Comment added:', updatedPost);
          this.post = updatedPost;
          this.newComment = '';
          this.showCommentForm = false;
        },
        error: (error) => {
          console.error('Error adding comment:', error);
        }
      });
    }
  }

  cancelComment() {
    this.showCommentForm = false;
    this.newComment = '';
  }

  addNewPost() {
    this.postService.createPost(this.newPost).subscribe({
      next: (post) => {
        console.log('Post created:', post);
        this.newPostAdded.emit(post);
        this.showAddForm = false;
        this.resetNewPost();
      },
      error: (error) => {
        console.error('Error creating post:', error);
      }
    });
  }

  private resetNewPost() {
    this.newPost = {
      id: '',
      userName: '',
      userImage: '',
      title: '',
      postDescription: '',
      postImage: '',
      createdAt: new Date().toISOString(),
      isLiked: false,
      comments: []
    };
    this.selectedProfileFile = null;
    this.profilePreviewUrl = null;
  }

  private resetEditForm() {
    this.selectedEditProfileFile = null;
    this.editProfilePreviewUrl = null;
  }

  onFileSelected(event: Event, type: 'profile' | 'post', isEdit: boolean = false) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (type === 'profile') {
        this.onProfileImageSelected(event, isEdit);
      } else {
        this.onPostImageSelected(event, isEdit);
      }
    }
  }

  onPostImageSelected(event: Event, isEdit: boolean = false) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      // Handle post image upload similar to profile image
      // You can implement the specific logic here
    }
  }

  get truncatedDescription(): string {
    if (!this.post.postDescription) return '';
    if (this.isDescriptionExpanded || this.post.postDescription.length <= this.maxDescriptionLength) {
      return this.post.postDescription;
    }
    return this.post.postDescription.substring(0, this.maxDescriptionLength) + '...';
  }

  toggleDescription() {
    this.isDescriptionExpanded = !this.isDescriptionExpanded;
  }
}
