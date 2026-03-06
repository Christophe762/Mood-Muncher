import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, interval, Subscription } from 'rxjs';

interface MoodMunchResponse {
  mood: string;
  snackSuggestion: string;
  imageUrl: string;
}

interface MoodSnackHistory {
  id: number;
  mood: string;
  snack: string;
  image_url: string;
  created_at: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="app-card">

      <h1>Mood Muncher 🍪</h1>

      <!-- LOGIN / SIGNUP -->
      <div *ngIf="!user" class="auth-section">
        <input type="text" placeholder="Email" [(ngModel)]="authEmail" />
        <input type="text" placeholder="Name (for signup)" [(ngModel)]="authName" />
        <input type="password" placeholder="Password" [(ngModel)]="authPassword" />
        <div class="auth-buttons">
          <button (click)="signup()">Sign Up</button>
          <button (click)="login()">Login</button>
        </div>
        <div *ngIf="error" class="error">{{ error }}</div>
      </div>

      <!-- MAIN APP -->
      <div *ngIf="user">
        <p>Welcome, {{ user.name }} (<a href="#" (click)="logout()">Logout</a>)</p>

        <div class="input-group">
          <input type="text" placeholder="How do you feel?" [(ngModel)]="mood" />
          <button (click)="getSnack()">MUNCH!</button>
        </div>

        <div *ngIf="loading" class="loading">{{ loadingMessage }}</div>

        <div *ngIf="snack">
          <h2>{{ snack }}</h2>
          <img [src]="imageUrl" alt="Absurd Snack" />
        </div>

        <hr *ngIf="history.length > 0" style="margin:20px 0; border-color:#ff6f61;" />

        <div *ngIf="history.length > 0" class="history-gallery">
          <h3>Previous Moods & Snacks 🍩</h3>
          <div class="history-items">
            <div *ngFor="let item of history" class="history-card">
              <p><strong>Mood:</strong> {{ item.mood }}</p>
              <p><strong>Snack:</strong> {{ item.snack }}</p>
              <img [src]="item.image_url" alt="Snack Image" />
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
  styleUrls: ['./app.css']
})
export class App implements OnInit {

  // Auth
  authEmail = '';
  authPassword = '';
  authName = '';
  user: User | null = null;
  token: string | null = null;

  // Snack app
  mood: string = '';
  snack: string = '';
  imageUrl: string = '';
  loading: boolean = false;
  loadingMessage: string = '';
  private messageSub?: Subscription;
  history: MoodSnackHistory[] = [];
  error: string = '';

  // API endpoints
  private apiUrl = 'http://localhost:3000/predict-snack-and-image';
  private historyUrl = 'http://localhost:3000/history';
  private loginUrl = 'http://localhost:3000/login';
  private signupUrl = 'http://localhost:3000/signup';

  private messages = [
    'Generating your snack...',
    'Please wait, it may take a few minutes...'
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.checkLocalStorage();
  }

  // -------------------- AUTH --------------------
  signup() {
    this.error = '';
    this.http.post<{ token: string, user: User }>(this.signupUrl, {
      email: this.authEmail,
      password: this.authPassword,
      name: this.authName
    }).subscribe({
      next: res => this.handleLoginSuccess(res),
      error: err => this.error = err.error?.error || 'Signup failed'
    });
  }

  login() {
    this.error = '';
    this.http.post<{ token: string, user: User }>(this.loginUrl, {
      email: this.authEmail,
      password: this.authPassword
    }).subscribe({
      next: res => this.handleLoginSuccess(res),
      error: err => this.error = err.error?.error || 'Login failed'
    });
  }

  logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    this.user = null;
    this.token = null;
    this.history = [];
  }

  handleLoginSuccess(res: { token: string, user: User }) {
    this.token = res.token;
    this.user = res.user;
    localStorage.setItem('jwt', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    this.fetchHistory();
  }

  checkLocalStorage() {
    const storedToken = localStorage.getItem('jwt');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      this.token = storedToken;
      this.user = JSON.parse(storedUser);
      this.fetchHistory();
    }
  }

  // -------------------- SNACKS --------------------
  getSnack() {
    if (!this.mood.trim() || !this.token) return;

    this.loading = true;
    this.snack = '';
    this.imageUrl = '';
    this.error = '';
    this.startLoadingMessage();

    this.http.post<MoodMunchResponse>(this.apiUrl, { mood: this.mood }, {
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe({
      next: res => {
        this.snack = res.snackSuggestion;
        this.imageUrl = res.imageUrl;
        this.stopLoadingMessage();
        this.loading = false;
        this.fetchHistory();
      },
      error: err => {
        console.error(err);
        this.error = 'Something went wrong. Try again!';
        this.stopLoadingMessage();
        this.loading = false;
      }
    });
  }

  fetchHistory() {
    if (!this.token) return;
    this.http.get<MoodSnackHistory[]>(this.historyUrl, {
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe({
      next: res => this.history = res,
      error: err => console.error('Failed to fetch history', err)
    });
  }

  // -------------------- LOADING MESSAGE --------------------
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