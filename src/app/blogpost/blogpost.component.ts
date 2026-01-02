import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { Post } from '../models/post.model';
import { PostService } from '../services/post';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-blogpost',
  imports: [
    CommonModule,
    FormsModule,
    MatFormField,
    MatInputModule,
    MatButtonModule,
    MatExpansionModule,
  ],
  templateUrl: './blogpost.component.html',
})
export class BlogpostComponent implements OnInit {
  posts = signal<Post[]>([]);

  // model: Partial<Post> = {
  //   title: '',
  //   text: '',
  //   author: '',
  // };

  @ViewChild('postForm') postForm!: NgForm;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loadPost();
  }

  loadPost() {
    this.postService.getPosts().subscribe((posts) => {
      this.postForm.resetForm(); // ✅ important
      this.posts.set(posts.sort((a, b) => b.publishedOn - a.publishedOn));
    });
  }

  publish(): void {
    if (this.postForm.invalid) return;

    const newPost: Post = {
      id: crypto.randomUUID(),
      title: this.postForm.value.title!,
      text: this.postForm.value.text!,
      author: this.postForm.value.author!,
      publishedOn: Date.now(),
    };

    this.postService.createPost(newPost).subscribe(() => {
      this.loadPost();
    });
  }
}
