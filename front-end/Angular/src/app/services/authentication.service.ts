import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as jwtdecode from 'jwt-decode';

import { Token } from '../models/token';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentTokenSubject: BehaviorSubject<Token>;
  public currentUserToken: Observable<Token>;
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    this.currentTokenSubject = new BehaviorSubject<Token>(JSON.parse(localStorage.getItem('token')));
    this.currentUserToken = this.currentTokenSubject.asObservable();
  }

  public get getCurrentUserToken(): Token {
    return this.currentTokenSubject.value;
  }

  extractTokenInfo(token_str: String): Token {
    const token = new Token();
    token.token = token_str;

    const decoded = jwtdecode(token_str);

    if (decoded.exp !== undefined) {
      const date = new Date(0);
      date.setUTCSeconds(decoded.exp);
      token.expires = date;
    }
    if (decoded.role !== undefined) {
      token.role = decoded.role;
    }

    return token;
  }

  login(email: string, password: string) {
    return this.http.post<any>(this.baseUrl + '/user/login', { email, password })
      .pipe(map(res => {
        // login successful if there's a jwt token in the response
        let token = new Token();
        if (res && res.message.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          token = this.extractTokenInfo(res.message.token);

          localStorage.setItem('token', JSON.stringify(token));
          this.currentTokenSubject.next(token);
        }
        return token;
      }));
  }

  register(firstname: string, lastname: string, email: string, password: string) {
    return this.http.post<any>(this.baseUrl + '/user/register', { 'name': { firstname, lastname }, email, password })
      .pipe(map(res => {
        let token = new Token();
        if (res && res.data.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          token = this.extractTokenInfo(res.data.token);

          localStorage.setItem('token', JSON.stringify(token));
          this.currentTokenSubject.next(token);
        }
        return token;
      }));
  }

  forgotPassword(email: String) {
    console.log(email);
    return this.http.post<any>(this.baseUrl + '/user/passwordreset', { email })
      .pipe(map(res => res));
  }

  checkToken(token: string) {
    return this.http.get(this.baseUrl + '/user/reset/' + token)
      .pipe(map((res) => { return res['status'] === 'success' }));
  }

  resetToken(token: string, password: string) {
    return this.http.post(this.baseUrl + '/user/reset/' + token, { 'password': password })
      .pipe(map((res) => { return res }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('token');
    this.currentTokenSubject.next(null);
  }

  isTokenExpired(token?: Token): boolean {
    if (token && token.token && token.expires) {
      const date = token.expires;
      return !(new Date(date).valueOf() > new Date().valueOf());
    } else {
      return true;
    }
  }

  isLoggedIn() {
    return !this.isTokenExpired(this.getCurrentUserToken);
  }

  getRole() {
    return this.getCurrentUserToken.role;
  }

  isAdmin() {
    return this.isLoggedIn && this.getRole().toLowerCase() === 'admin';
  }
}
