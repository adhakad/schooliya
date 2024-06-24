import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.css']
})
export class NoticeComponent implements OnInit {

  notifications:any[]=[];
  loader:Boolean=true;

  constructor(private notificationService:NotificationService) { }

  ngOnInit(): void {
    this.notification();
  }

  notification(){


    this.notificationService.getNotificationList().subscribe((res:any) => {
      if(res){
        this.notifications = res;
        setTimeout(() => {
          this.loader = false;
        }, 1000)
      }
    })
  }
}
