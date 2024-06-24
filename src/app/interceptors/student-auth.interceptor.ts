import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpClient
} from '@angular/common/http';
import {catchError, Observable, switchMap, throwError} from 'rxjs';
import { StudentAuthService } from '../services/auth/student-auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class StudentAuthInterceptor implements HttpInterceptor {
  url = `${environment.API_URL}/api/student-user`;
  refresh=false
  
  constructor(private http:HttpClient, private studentAuthService: StudentAuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const accessToken = this.studentAuthService.getAccessToken()?.accessToken;
    
    if(accessToken){
      
      const req = request.clone({
        setHeaders:{
          authorization : `Bearer ${accessToken}`
        }
      })

      return next.handle(req).pipe(catchError((err: HttpErrorResponse) => {
        if (err.status === 403 && !this.refresh) {
          this.refresh = true;
          const refreshToken = this.studentAuthService.getRefreshToken()?.refreshToken;
          return this.http.post(`${this.url}/refresh`, {token:refreshToken}).pipe(
            switchMap((res: any) => {
              const newAccessToken = res.accessToken
              this.studentAuthService.storeAccessToken(newAccessToken)
              return next.handle(request.clone({
                setHeaders: {
                  Authorization: `Bearer ${newAccessToken}`
                }
              }));
            })
          ) as Observable<HttpEvent<any>>;
        }
        this.refresh = false;
        return throwError(() => err);
      }));

    }

    return next.handle(request)

  }
}
