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

	login(username: string, password: string) {
		return this.http.post<any>(this.baseUrl + "/user/login", { "email": username, password })
			.pipe(map(user => {
				// login successful if there's a jwt token in the response
				let token = new Token();
				if (user && user.message.token) {
					// store user details and jwt token in local storage to keep user logged in between page refreshes
					token = this.extractTokenInfo(user.message.token);

					localStorage.setItem('token', JSON.stringify(token));
					this.currentTokenSubject.next(token);
				}
				return token;
			}));
	}

	extractTokenInfo(token_str: String): Token {
		let token = new Token();
		token.token = token_str;

		var decoded = jwtdecode(token_str);

		if (decoded.exp !== undefined) {
			const date = new Date(0);
			date.setUTCSeconds(decoded.exp);
			token.expires = date;
		}
		if (decoded.role !== undefined) token.role = decoded.role;

		return token;
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
		}
		else {
			return true;
		}
	}

	isLoggedIn() {
		return !this.isTokenExpired(this.getCurrentUserToken);
	}

	getRole() {
		return this.getCurrentUserToken.role;
	}

}
