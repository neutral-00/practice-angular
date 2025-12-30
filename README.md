# Angular Unit Test Demo

- [x] 12.1 create a 404 component
- [x] 12.2 create unit test

## Brief Theory

When angular routing doesn't match any path, we can fallback to a not found component.

## Project Metadata

- Repository: https://github.com/neutral-00/practice-angular
- Parent branch: 11-singal-demo
- Working branch: 12-unit-test-demo

## Scenario

Let's create a 404 page and route to it when no other route matches. On top of it we will unit test some of this component's features.

## Steps

### 1. Create NotFound Component

But first let's add the below images, that we will use later

- `public/oasis_morning.png`
- `public/oasis_noon.png`
- `public/oasis_sunset.png`
- `public/oasis_night.png`

run the below command

```
ng g c components/not-found --inline-template --style none --type=component
```

Now update `src/app/components/not-found/not-found.componen.ts` with the below code:

```ts
import { Component, signal, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  encapsulation: ViewEncapsulation.Emulated,
  template: `
    <div class="flex flex-col items-center justify-center h-screen text-center">
      <h1 class="text-6xl font-extrabold">
        <span class="text-transparent bg-clip-text bg-linear-to-r from-yellow-500 to-orange-600">
          404
        </span>
        🌵
      </h1>
      <p class="mt-4 text-lg text-gray-700">{{ greeting() }}</p>
      <img [src]="imagePath()" alt="Desert Oasis" class="w-64 h-64 mt-6 rounded-lg shadow-lg" />
      <a
        routerLink="/"
        class="mt-8 px-6 py-3 text-white bg-green-600 rounded-lg shadow hover:bg-green-700 transition"
      >
        🏠 Back to Home
      </a>
    </div>
  `,
})
export class NotFoundComponent {
  imagePath = signal(this.getOasisImage());
  greeting = signal(this.getGreeting());

  constructor() {
    // Refresh every minute so both image and greeting stay in sync
    setInterval(() => {
      this.imagePath.set(this.getOasisImage());
      this.greeting.set(this.getGreeting());
    }, 30000);
  }

  private getOasisImage(): string {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 10) return 'oasis_morning.png';
    if (hour >= 10 && hour < 17) return 'oasis_noon.png';
    if (hour >= 17 && hour < 20) return 'oasis_sunset.png';
    return 'oasis_night.png';
  }

  private getGreeting(): string {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 10) return 'Good morning, wanderer 🌞';
    if (hour >= 10 && hour < 17) return 'Enjoy the midday sun ☀️';
    if (hour >= 17 && hour < 20) return 'Sunset is near 🌇';
    return 'Rest easy under the moon 🌙';
  }
}
```

### 2. Update the spec file

Let's update the `src/app/components/not-found/not-found.spec.ts` to unit test this component

```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  let fixture: ComponentFixture<NotFoundComponent>;
  let component: NotFoundComponent;

  beforeEach(async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 12, 23, 8));
    // vi.setSystemTime(new Date(2025, 11, 23, 13));

    await TestBed.configureTestingModule({
      imports: [NotFoundComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render the greeting text in the template', () => {
    fixture.detectChanges(); // trigger initial render

    const element = fixture.nativeElement as HTMLElement;
    const paragraph = element.querySelector('p');

    expect(paragraph?.textContent).toContain('Good morning, wanderer 🌞');
  });

  it('should bind the correct image src', () => {
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const image = element.querySelector('img') as HTMLImageElement;

    expect(image.src).toContain('oasis_morning.png');
  });

  it('should update the dom after interval runs', () => {
    fixture.detectChanges();

    // Move the time forward to noon
    vi.setSystemTime(new Date(2025, 11, 23, 12));
    vi.advanceTimersByTime(30_000);
    fixture.detectChanges(); // 🔑 udpate DOM

    const element = fixture.nativeElement as HTMLElement;
    const paragraph = element.querySelector('p');
    expect(paragraph?.textContent).toBe('Enjoy the midday sun ☀️');
  });

  it('should update greeting and image after interval when time changes', () => {
    // Initial state (08:00)
    expect(component.greeting()).toBe('Good morning, wanderer 🌞');
    expect(component.imagePath()).toBe('oasis_morning.png');

    // Move time forward to noon
    vi.setSystemTime(new Date(2025, 11, 23, 12, 0));
    vi.advanceTimersByTime(30_000); // trigger setInterval

    expect(component.greeting()).toBe('Enjoy the midday sun ☀️');
    expect(component.imagePath()).toBe('oasis_noon.png');
  });
});
```

Next update the `src/app/app.routes.ts` with the below code

```ts
import { Routes } from '@angular/router';
import { CounterComponent } from './components/counter/counter.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
  { path: 'counter', component: CounterComponent },
  { path: '', redirectTo: '/counter', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];
```

Make sure the entry for NotFoundComponent is in the last part of the routes array.

Now in the brower hit [counter](http://localhost:4200/about)

Next to run test, open command prompt and run `ng test`
