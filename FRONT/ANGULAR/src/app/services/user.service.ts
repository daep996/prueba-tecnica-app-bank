import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userId = ''

  constructor() {
    const token = this.getToken()
    if (token) {
      const decoded = jwtDecode<CustomJwtPayload>(token)
      this.userId = decoded.userId
    }
  }

  setToken(token: string) : void {
    const decoded = jwtDecode<CustomJwtPayload>(token)
    localStorage.setItem('token', token)
    this.setUserId(decoded.userId)
  }

  getToken(): string | null {
    return localStorage.getItem('token')
  }

  private setUserId(userId: string): void {
    this.userId = userId
  }

  getUserId(): string {
    return this.userId
  }

  clearUserData(): void {
    localStorage.removeItem('token')
    this.userId = ''
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && this.userId !== ''
  }
}