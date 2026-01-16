import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  sendMessage(message: ContactMessage): Observable<any> {
    return this.http.post<{data: any}>(`${this.apiUrl}/contact`, message)
      .pipe(
        tap(response => console.log('✅ Contact message sent:', response)),
        catchError(error => {
          console.error('❌ Error sending message:', error);
          throw error;
        })
      );
  }
}
