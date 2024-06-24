import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StudentAuthService } from '../services/auth/student-auth.service';

@Injectable({
  providedIn: 'root'
})
export class StudentAuthGuard implements CanActivate {
  constructor(private studentAuthService: StudentAuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const isAccessToken = this.studentAuthService.getAccessToken()?.accessToken;
      if (isAccessToken) {
        return true
      } 
      return this.router.navigate(["/"]);
    }  
}