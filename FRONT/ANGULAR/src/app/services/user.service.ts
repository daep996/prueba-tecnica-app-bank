import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface CustomJwtPayload extends JwtPayload {
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userId = -1;

  constructor() {
    const token = this.getToken();
    if (token) {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      this.userId = Number(decoded.userId);
    }
  }

  setToken(token: string) : void {
    const decoded = jwtDecode<CustomJwtPayload>(token);
    localStorage.setItem('token', token);
    this.setUserId(Number(decoded.userId))
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private setUserId(userId: number): void {
    this.userId = userId
  }

  getUserId(): number {
    return this.userId;
  }

  clearUserData(): void {
    localStorage.removeItem('token');
    this.userId = -1
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && this.userId !== -1;
  }
}