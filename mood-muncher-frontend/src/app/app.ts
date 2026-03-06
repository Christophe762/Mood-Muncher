import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, interval, Subscription } from 'rxjs';

interface MoodMunchResponse {
  mood: string;
  snackSuggestion: string;
  imageUrl: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="app-card">
      <h1>Mood Muncher 🍪</h1>

      <div class="input-group">
        <input type="text" placeholder="How do you feel?" [(ngModel)]="mood" />
        <button (click)="getSnack()">MUNCH!</button>
      </div>

      <!-- Alternating loading message -->
      <div *ngIf="loading" class="loading">{{ loadingMessage }}</div>

      <div *ngIf="snack">
        <h2>{{ snack }}</h2>
        <img [src]="imageUrl" alt="Absurd Snack" />
      </div>

      <div *ngIf="error" class="error">{{ error }}</div>
    </div>
  `,
  styleUrls: ['./app.css']
})
export class App {
  mood: string = '';
  snack: string = '';
  imageUrl: string = '';
  loading: boolean = false;
  error: string = '';
  loadingMessage: string = '';
  private messageSub?: Subscription;

  private apiUrl = 'http://localhost:3000/predict-snack-and-image';
  private messages = [
    'Generating your snack...',
    'Please wait, it may take a few minutes...'
  ];

  constructor(private http: HttpClient) {}

  getSnack() {
    if (!this.mood.trim()) return;

    this.loading = true;
    this.snack = '';
    this.imageUrl = '';
    this.error = '';
    this.startLoadingMessage();

    this.fetchSnack(this.mood).subscribe({
      next: (res) => {
        this.snack = res.snackSuggestion;
        this.imageUrl = res.imageUrl;
        this.stopLoadingMessage();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Something went wrong. Try again!';
        this.stopLoadingMessage();
        this.loading = false;
      }
    });
  }

  fetchSnack(mood: string): Observable<MoodMunchResponse> {
    return this.http.post<MoodMunchResponse>(this.apiUrl, { mood });
  }

  startLoadingMessage() {
    let index = 0;
    this.loadingMessage = this.messages[index];

    this.messageSub = interval(2000).subscribe(() => {
      index = (index + 1) % this.messages.length;
      this.loadingMessage = this.messages[index];
    });
  }

  stopLoadingMessage() {
    if (this.messageSub) {
      this.messageSub.unsubscribe();
      this.messageSub = undefined;
    }
  }
}