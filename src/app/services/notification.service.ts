import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { StudentAuthService } from './auth/student-auth.service';
import { TeacherAuthService } from './auth/teacher-auth.service';
import { AdminAuthService } from './auth/admin-auth.service';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  url = `${environment.API_URL}/v1/notification`;
  loggedInStudentInfo:any;
  loggedInTeacherInfo:any;
  loggedInAdminInfo:any;
  cls:Number=0;
  
  constructor(private http:HttpClient,private cookieService:CookieService,private studentAuthService:StudentAuthService,private teacherAuthService:TeacherAuthService,private adminAuthService:AdminAuthService) { }

  addNotification(notificationData:any){
    return this.http.post(this.url,notificationData);
  }
  getNotificationList() {
    this.loggedInStudentInfo = this.studentAuthService.getLoggedInStudentInfo();
    this.loggedInTeacherInfo = this.teacherAuthService.getLoggedInTeacherInfo();
    this.loggedInAdminInfo = this.adminAuthService.getLoggedInAdminInfo();
    if (this.loggedInStudentInfo) {
      this.cls = this.loggedInStudentInfo?.class;
    }
    if(this.loggedInTeacherInfo){
      this.cls = 101;
    }
    if(this.loggedInAdminInfo){
      this.cls = 102;
    }
    if(!this.loggedInStudentInfo && !this.loggedInTeacherInfo && !this.loggedInAdminInfo){
      this.cls = 102;
    }
    return this.http.get<any>(`${this.url}/${this.cls}`);
  }
  notificationPaginationList(notificationData:any){
    return this.http.post(`${this.url}/notification-pagination`,notificationData);
  }
  getNotificationCount() {
    return this.http.get(`${this.url}/notification-count`);
  }
  updateNotification(notificationData:any){
    return this.http.put(`${this.url}/${notificationData._id}`, notificationData);
  }
  deleteNotification(id:String){
    return this.http.delete(`${this.url}/${id}`);
  }
  storeViewNotification(data:any){
    this.cookieService.set("_vN",JSON.stringify(data),10);
  }
}
