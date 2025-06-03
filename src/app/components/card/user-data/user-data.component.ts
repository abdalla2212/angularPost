// import { Component, input } from '@angular/core';
// import { IPost } from '../../../models/post.model';

import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../../models/post.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class UserDataComponent implements OnInit {
  @Input() post!: Post;

  ngOnInit() {
    console.log('User data component initialized with post:', this.post);
  }

  getFormattedDate(): string {
    const date = new Date(this.post.createdAt);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

