import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const currentUserToken = this.authenticationService.getCurrentUserToken;
    if (currentUserToken && currentUserToken.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUserToken.token}`,
            'Accept-Encoding': 'application/gzip',
          // 'Content-Type': 'application/json'
        }
      });
    }

    return next.handle(request);
  }
}
