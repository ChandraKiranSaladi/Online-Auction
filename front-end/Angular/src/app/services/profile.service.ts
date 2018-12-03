import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUserDetails() {
    return this.http.get(this.baseUrl + "/user/profile").pipe(
      map((res: Response) => { return res })
    )
  }
}
