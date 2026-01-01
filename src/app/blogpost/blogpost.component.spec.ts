import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogpostComponent } from './blogpost.component';

describe('BlogpostComponent', () => {
  let component: BlogpostComponent;
  let fixture: ComponentFixture<BlogpostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogpostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogpostComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
