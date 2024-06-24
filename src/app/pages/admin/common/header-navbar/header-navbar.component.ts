import { Component, OnInit, OnDestroy} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from "rxjs";
import { AdminAuthService } from 'src/app/services/auth/admin-auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header-navbar',
  templateUrl: './header-navbar.component.html',
  styleUrls: ['./header-navbar.component.css'],
  
})
export class HeaderNavbarComponent implements OnInit {
  public schoolName = environment.SCHOOL_NAME;
  nav:boolean = false;

  token: string = '';
  isAdminAuthenticated = false;
  private authListenerSubs: Subscription | undefined;
  constructor(private adminAuthService: AdminAuthService) {}

  ngOnInit(): void {
    this.adminAuthService.autoAuthAdmin();
    this.isAdminAuthenticated = this.adminAuthService.getIsAuth();
    this.authListenerSubs = this.adminAuthService
      .getAuthStatusListener()
      .subscribe(isAdminAuthenticated => {
        this.isAdminAuthenticated = isAdminAuthenticated;
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
    if (user === 'admin') {
      this.adminAuthService.logout();
    }
  }

  ngOnDestroy() {
    this.authListenerSubs?.unsubscribe();
  }

}
