import { Component, OnInit, OnDestroy, } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from "rxjs";
import { AdminAuthService } from "src/app/services/auth/admin-auth.service";
import { TeacherAuthService } from "src/app/services/auth/teacher-auth.service";
import { StudentAuthService } from "src/app/services/auth/student-auth.service";
import { environment } from "src/environments/environment";
import { ClassService } from "src/app/services/class.service";
import { StudentService } from "src/app/services/student.service";
import { CookieService } from "ngx-cookie-service";
import { NotificationService } from "src/app/services/notification.service";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public schoolName = environment.SCHOOL_NAME;
  nav: boolean = false;
  panelOpenState: boolean = false
  softwareCompanyLink:string='https://schooliya.in';
  token: string = '';
  isAdminAuthenticated = false;
  isTeacherAuthenticated = false;
  isStudentAuthenticated = false;
  private authListenerSubs: Subscription | undefined;

  enteredButton = false;
  isMatMenuOpen = false;
  isMatMenu2Open = false;
  prevButtonTrigger: any;
  modulesList: any;

  notification: any;
  notificationCount: any;
  notificationCookie: any;

  
  constructor( private notificationService: NotificationService, private cookieService: CookieService, private adminAuthService: AdminAuthService, private teacherAuthService: TeacherAuthService, private studentAuthService: StudentAuthService) {}



  ngOnInit() {
    let userDetail = this.studentAuthService.getLoggedInStudentInfo();
    if (userDetail) {
    }

    this.adminAuthService.autoAuthAdmin();
    this.isAdminAuthenticated = this.adminAuthService.getIsAuth();
    this.authListenerSubs = this.adminAuthService
      .getAuthStatusListener()
      .subscribe(isAdminAuthenticated => {
        this.isAdminAuthenticated = isAdminAuthenticated;
      });

    this.teacherAuthService.autoAuthTeacher();
    this.isTeacherAuthenticated = this.teacherAuthService.getIsAuth();
    this.authListenerSubs = this.teacherAuthService
      .getAuthStatusListener()
      .subscribe(isTeacherAuthenticated => {
        this.isTeacherAuthenticated = isTeacherAuthenticated;
      });

    this.studentAuthService.autoAuthStudent();
    this.isStudentAuthenticated = this.studentAuthService.getIsAuth();
    this.authListenerSubs = this.studentAuthService
      .getAuthStatusListener()
      .subscribe(isStudentAuthenticated => {
        this.isStudentAuthenticated = isStudentAuthenticated;
      });

    this.getNotification();
  }
  hamburgerMenu(val: boolean) {
    if (val == true) {
      this.nav = true;
    } else if (val == false) {
      this.nav = false;
    }
  }
  softwareCompany(link:string){
    const sanitizedLink = encodeURI(link);
    window.location.href = sanitizedLink;
  }
  // onLogout(user: string) {
  //   if (user === 'admin') {
  //     this.adminAuthService.logout();
  //   } else if (user === 'teacher') {
  //     this.teacherAuthService.logout();
  //   } else {
  //     this.studentAuthService.logout();
  //   }
  // }
  getNotification() {
    this.notificationService.getNotificationList().subscribe((res: any) => {
      if (res) {
        this.notification = res;
        if (this.cookieService.get("_vN")) {
          this.notificationCookie = JSON.parse(this.cookieService.get("_vN"));
          let filterNotification = this.notification.filter(({ _id: id1 }: any) => this.notificationCookie.some(({ _id: id2 }: any) => id2 === id1))
            .map((item: any) => {
              return { "_id": item._id }
            });
          let checkCookie = this.notificationCookie.filter(({ _id: id1 }: any) => !filterNotification.some(({ _id: id2 }: any) => id2 === id1))
          if (checkCookie.length > 0) {
            this.notificationService.storeViewNotification(filterNotification);
          }
          this.notificationCount = this.notification.length - filterNotification?.length;
          return;
        }
        this.notificationCount = this.notification.length;
      }
    })
  }

  viewNotification() {
    if (this.notification) {
      console.log(this.notification);
      let data: any = [];
      if (this.notificationCookie) {
        let filterNotification = this.notification.filter(({ _id: id1 }: any) => !this.notificationCookie.some(({ _id: id2 }: any) => id2 === id1));
        console.log(filterNotification)
        for (let i = 0; i < filterNotification.length; i++) {
          let newNotification = { "_id": filterNotification[i]._id };
          data.push(newNotification, ...this.notificationCookie)
        }
        if (data.length > 0) {
          this.notificationService.storeViewNotification(data)
        }
        return
      }
      data = this.notification.map((item: any) => {
        return { "_id": item._id };
      })
      this.notificationService.storeViewNotification(data)
    }
  }
  
  ngOnDestroy() {
    this.authListenerSubs?.unsubscribe();
  }

}
