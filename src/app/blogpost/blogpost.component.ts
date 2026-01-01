import { Component, OnInit } from '@angular/core';
import { Post } from '../models/post.model';
import { PostService } from '../services/post';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blogpost',
  imports: [CommonModule, FormsModule],
  templateUrl: './blogpost.component.html',
})
export class BlogpostComponent implements OnInit {
  posts: Post[] = [];

  model: Partial<Post> = {
    title: '',
    text: '',
    author: '',
  };

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loadPost();
  }

  loadPost() {
    this.postService.getPosts().subscribe((posts) => {
      this.posts = posts.sort((a, b) => b.publishedOn - a.publishedOn);
    });
  }

  publish(): void {
    if (!this.model.text) return;

    const newPost: Post = {
      id: crypto.randomUUID(),
      title: this.model.title!,
      text: this.model.text!,
      author: this.model.author!,
      publishedOn: Date.now(),
    };

    this.postService.createPost(newPost).subscribe(() => {
      this.model = { title: '', text: '', author: '' };
      this.loadPost();
    });
  }
}
