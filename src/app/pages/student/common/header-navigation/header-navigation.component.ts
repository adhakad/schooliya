import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StudentAuthService } from 'src/app/services/auth/student-auth.service';
import { TeacherAuthService } from 'src/app/services/auth/teacher-auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header-navigation',
  templateUrl: './header-navigation.component.html',
  styleUrls: ['./header-navigation.component.css']
})
export class HeaderNavigationComponent implements OnInit {
  public schoolName = environment.SCHOOL_NAME;
  nav:boolean = false;
  token: string = '';
  isStudentAuthenticated = false;
  private authListenerSubs: Subscription | undefined;

  constructor(private studentAuthService: StudentAuthService) {}

  ngOnInit(): void {
    this.studentAuthService.autoAuthStudent();
    this.isStudentAuthenticated = this.studentAuthService.getIsAuth();
    this.authListenerSubs = this.studentAuthService
      .getAuthStatusListener()
      .subscribe(isStudentAuthenticated => {
        this.isStudentAuthenticated = isStudentAuthenticated;
      });
  }

  hamburgerMenu(val:boolean){
    if(val==true){
      this.nav = true;
    }else if(val==false){
      this.nav = false;
    }
  }
  onLogout(user: string) {
    if (user === 'student') {
      this.studentAuthService.logout();
    }
  }
  ngOnDestroy() {
    this.authListenerSubs?.unsubscribe();
  }
}
