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
