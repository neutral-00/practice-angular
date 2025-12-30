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
