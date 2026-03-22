import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'krz-game-page',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule],
})
export class GamePage {
  @ViewChild('hiddenInput') hiddenInput!: ElementRef<HTMLInputElement>;

  currentNumber: string = this.randomDigit();

  history: string[] = [this.currentNumber];

  score: number = 0;
  isPulsing: boolean = false;
  isHidden: boolean = false;

  feedback: 'correct' | 'wrong' | null = null;

  readonly targetOffset: number = -1;

  constructor(private renderer: Renderer2) {
    setTimeout(() => {
      this.isHidden = true;
      this.setResetReadOnly(!this.hiddenInput);
      this.hiddenInput.nativeElement.focus();
    }, 700);
  }

  setResetReadOnly(set: boolean): void {
    if (set) {
      this.renderer.setProperty(this.hiddenInput.nativeElement, 'readOnly', true)
    } else {
      this.renderer.setProperty(this.hiddenInput.nativeElement, 'readOnly', false)
    }
  }
  
  focusInput(): void {
    this.hiddenInput.nativeElement.value = '';
    this.hiddenInput.nativeElement.focus();
  }

  onInput(event: Event): void {
    if (!this.isHidden) return;
    const input = event.target as HTMLInputElement;
    const lastChar = input.value.slice(-1);
    const digit = parseInt(lastChar, 10);
    input.value = '';

    if (isNaN(digit) || digit < 0 || digit > 9) return;
    
    this.evaluate(digit.toString());
  }

  onInputBlur(): void {}

  private evaluate(guess: string): void {
    const correct = this.correctAnswer;

    this.isHidden = false;
      this.setResetReadOnly(!this.hiddenInput);

    if (guess === correct) {
      this.score++;
      this.showFeedback('correct');
    } else {
      this.score = 0;
      this.showFeedback('wrong');
    }
    this.advanceNumber();
  }

  private advanceNumber(): void {
    const next = this.randomDigit();
    this.history.push(next);
    this.currentNumber = next;
    this.triggerPulse();
    setTimeout(() => {
      this.isHidden = true;
      this.setResetReadOnly(!this.hiddenInput);
    }, 400);
  }

  get correctAnswer(): string {
    return this.history.at(this.targetOffset) as string
  }

  private feedbackTimer: ReturnType<typeof setTimeout> | null = null;

  private showFeedback(type: 'correct' | 'wrong'): void {
    if (this.feedbackTimer) clearTimeout(this.feedbackTimer);
    this.feedback = type;
    this.feedbackTimer = setTimeout(() => (this.feedback = null), 600);
  }

  private triggerPulse(): void {
    this.isPulsing = false;
    setTimeout(() => (this.isPulsing = true), 10);
    setTimeout(() => (this.isPulsing = false), 400);
  }

  private randomDigit(): string {
    return Math.floor(Math.random() * 10).toString();
  }
}