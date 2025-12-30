import { isPlatformBrowser } from '@angular/common';
import { Component, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AppEvent } from '../../models/AppEvent';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div
      class="max-w-md mx-auto p-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl"
    >
      <!-- Persistence Status -->
      <div class="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-2xl text-center">
        <div class="text-indigo-100 font-medium">💾 Persisted in localStorage</div>
        <div class="text-sm text-indigo-200 mt-1">Refreshes survive • Clears on Reset</div>
      </div>

      <!-- Counter Display -->
      <div class="text-center my-6 text-8xl font-mono font-black text-white tracking-tight">
        {{ count() }}
      </div>

      <!-- Liquid Glass Controls -->
      <div class="flex flex-row gap-3 justify-center flex-wrap mb-6">
        <!-- ➕ Increase -->
        <button
          (click)="increment()"
          class="group relative flex-1 py-4 px-8 bg-white/10 backdrop-blur-xl text-white font-bold text-lg rounded-2xl
                  border border-white/30 shadow-2xl hover:shadow-green-500/40 active:shadow-green-500/60
                  transition-all duration-500 ease-out hover:scale-[1.02] active:scale-95 hover:bg-white/25 cursor-pointer
                  before:absolute before:inset-0 before:bg-gradient-to-r before:from-emerald-400/30 before:to-green-400/30
                  before:rounded-2xl before:blur-xl before:opacity-0 before:group-hover:opacity-100 before:transition-all before:duration-700
                  after:absolute after:inset-1 after:bg-gradient-to-r after:from-emerald-200/40 after:to-green-200/40
                  after:rounded-xl after:backdrop-blur-sm after:shadow-inner after:shadow-white/30 z-0"
        >
          <div
            class="relative z-20 flex items-center justify-center gap-1 bg-black/20 px-2 py-1 rounded-xl backdrop-blur-sm"
          >
            <span class="text-emerald-300 text-xl drop-shadow-lg">➕</span>
            <span class="text-white drop-shadow-md">Increase</span>
          </div>
        </button>

        <!-- ➖ Decrease -->
        <button
          (click)="decrement()"
          class="group relative flex-1 py-4 px-8 bg-white/5 backdrop-blur-xl text-white font-bold text-lg rounded-2xl
                  border border-white/20 shadow-2xl hover:shadow-red-500/40 active:shadow-red-500/60
                  transition-all duration-500 ease-out hover:scale-[1.02] active:scale-95 hover:bg-white/20 cursor-pointer
                  before:absolute before:inset-0 before:bg-gradient-to-r before:from-rose-400/30 before:to-red-400/30
                  before:rounded-2xl before:blur-xl before:opacity-0 before:group-hover:opacity-100 before:transition-all before:duration-700
                  after:absolute after:inset-1 after:bg-gradient-to-r after:from-rose-200/30 after:to-red-200/30
                  after:rounded-xl after:backdrop-blur-sm after:shadow-inner after:shadow-white/20 z-0
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg disabled:before:opacity-0"
          [disabled]="count() <= 0"
        >
          <div
            class="relative z-20 flex items-center justify-center gap-1 bg-black/20 px-2 py-1 rounded-xl backdrop-blur-sm"
          >
            <span class="text-rose-300 text-xl drop-shadow-lg">➖</span>
            <span class="text-white drop-shadow-md">Decrease</span>
          </div>
        </button>

        <!-- 🔄 Reset -->
        <button
          (click)="reset()"
          class="group relative flex-1 py-4 px-12 bg-white/15 backdrop-blur-xl text-white font-bold text-lg rounded-2xl
                  border-2 border-white/40 shadow-2xl hover:shadow-indigo-500/50 active:shadow-indigo-500/70
                  transition-all duration-500 ease-out hover:scale-[1.02] active:scale-95 hover:bg-white/25 cursor-pointer
                  before:absolute before:inset-0 before:bg-gradient-to-br before:from-cyan-400/40 before:to-indigo-400/40
                  before:rounded-2xl before:blur-2xl before:opacity-0 before:group-hover:opacity-100 before:transition-all before:duration-700
                  after:absolute after:inset-1 after:bg-gradient-to-r after:from-indigo-200/50 after:to-purple-200/50
                  after:rounded-xl after:backdrop-blur-md after:shadow-inner after:shadow-white/40 z-0"
        >
          <div
            class="relative z-20 flex items-center justify-center bg-black/20 px-2 py-1 rounded-xl backdrop-blur-sm"
          >
            <span class="text-cyan-300 drop-shadow-lg">🔄</span>
            <span class="text-white drop-shadow-md ml-1">Reset</span>
          </div>
        </button>
      </div>

      <!-- Recent Events -->
      <div class="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
        <!-- Update events header -->
        <div class="font-semibold mb-3 flex items-center gap-2 text-indigo-100">
          📋 Recent Events ({{ events().length }} / {{ MAX_EVENTS }})
        </div>

        <div class="space-y-2 max-h-40 overflow-y-auto">
          @for (ev of events(); track ev.id) {
            <div class="flex justify-between items-center p-2 bg-purple-500 rounded-lg">
              <span class="text-indigo-200 text-sm">{{ ev.event }}</span>
              <span class="text-indigo-300 text-xs">{{
                ev.timestamp | date: 'yy-MM-dd HH:mm:ss'
              }}</span>
            </div>
          } @empty {
            <div class="text-center text-indigo-300 text-sm py-4">No events yet</div>
          }
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class CounterComponent {
  private platformId = inject(PLATFORM_ID);
  count = signal(0);
  events = signal<AppEvent[]>([]);
  readonly MAX_EVENTS = 50; // ✅ Fixed naming

  constructor() {
    // Load from localStorage on init (browser only)
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('persistentCounter');
      if (saved) {
        const data = JSON.parse(saved);
        // restore counter and events
        this.count.set(data.count || 0);
        if (data.events) this.events.set(data.events);
      }
    }

    // auto-save effect (runs on signal changes)
    // suppose to be used for logging | don't produce new signal in effect.
    // if new signals needs to be produced, use computed instead
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(
          'persistentCounter',
          JSON.stringify({
            count: this.count(),
            events: this.events(),
          }),
        );
      }
    });
  }

  // ✅ NEW: Centralized addEvent method
  private addEvent(event: string, triggeredBy: 'USER' | 'SYSTEM') {
    const newEvent: AppEvent = {
      id: crypto.randomUUID?.() ?? Date.now().toString(),
      timestamp: Date.now(),
      triggeredBy,
      event,
    };

    this.events.update((currentEvents) => {
      const updated = [newEvent, ...currentEvents]; // ✅ Newest first
      return updated.slice(0, this.MAX_EVENTS); // ✅ Keep only last 50
    });
  }

  increment() {
    this.count.update((v) => v + 1);
    this.addEvent('Counter increment', 'USER');
  }

  decrement() {
    if (this.count() > 0) {
      this.count.update((v) => v - 1);
      this.addEvent('Counter decrement', 'USER');
    }
  }

  reset() {
    this.count.set(0);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('persistentCounter');
    }
    this.addEvent('Counter reset by User', 'USER');
  }
}
