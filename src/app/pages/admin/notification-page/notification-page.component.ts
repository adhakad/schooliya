import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { ClassService } from 'src/app/services/class.service';
import { Class } from 'src/app/modal/class.model';

@Component({
  selector: 'app-notification-page',
  templateUrl: './notification-page.component.html',
  styleUrls: ['./notification-page.component.css']
})
export class NotificationPageComponent implements OnInit {

  notificationForm: FormGroup;
  showModal: boolean = false;
  updateMode: boolean = false;
  deleteMode: boolean = false;
  roleStudent:boolean=false;
  deleteById: String = '';
  successMsg: String = '';
  errorMsg: String = '';
  errorCheck: Boolean = false;
  classInfo: any[] = [];
  roleInfo: any[] = [];
  notificationInfo: any[] = [];
  recordLimit: number = 10;
  filters: any = {};
  number: number = 0;
  date:any;
  time:any;
  paginationValues: Subject<any> = new Subject();
 loader:Boolean=true;
  constructor(private fb: FormBuilder, private classService: ClassService, private notificationService: NotificationService) {
    this.notificationForm = this.fb.group({
      _id: [''],
      role: ['', Validators.required],
      class: [''],
      title: ['', Validators.required],
      message: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    let load:any=this.getNotifications({ page: 1 });
    this.getClass();
    this.getRole();
    if(load){
      setTimeout(()=>{
        this.loader = false;
      },1000);
    }
  }
  closeModal() {
    this.showModal = false;
    this.updateMode = false;
    this.deleteMode = false;
    this.errorMsg = '';
  }
  addNotificationModel() {
    this.showModal = true;
    this.deleteMode = false;
    this.updateMode = false;
    this.notificationForm.reset();
  }
  updateNotificationModel(notification: any) {
    this.showModal = true;
    this.deleteMode = false;
    this.updateMode = true;
    this.notificationForm.patchValue(notification);
  }
  deleteNotificationModel(id: String) {
    this.showModal = true;
    this.updateMode = false;
    this.deleteMode = true;
    this.deleteById = id;
  }

  checkRole(role:any){
    if(role == "Student"){
      this.roleStudent = true;
    }
  }
  private getRole() {
    // this.roleInfo = [{ role: "Student" }, { role: "Teacher" }, { role: "Public" }]
    this.roleInfo = [{ role: "Student" }, { role: "Public" }]
  }

  getClass() {
    this.classService.getClassList().subscribe((res: any[]) => {
      if (res) {
        this.classInfo = res;
      }
    })
  }
  successDone() {
    setTimeout(() => {
      this.closeModal();
      this.successMsg = '';
      this.roleStudent = false;
      this.getNotifications({ page: 1 });
    }, 1000)
  }

  getNotifications($event: any) {
    return new Promise((resolve, reject) => {
      let params: any = {
        filters: {},
        page: $event.page,
        limit: $event.limit ? $event.limit : this.recordLimit
      };
      this.recordLimit = params.limit;
      if (this.filters.searchText) {
        params["filters"]["searchText"] = this.filters.searchText.trim();
      }

      this.notificationService.notificationPaginationList(params).subscribe((res: any) => {
        if (res) {
          this.notificationInfo = res.notificationList;
          this.number = params.page;
          for (let i = 0; i < this.notificationInfo.length; i++) {
            let dateTime = this.notificationInfo[i].date;
            this.date = new Date(dateTime).toLocaleString("en-US", {
              timeZone: 'Asia/Kolkata',
              year: 'numeric',
              day: 'numeric',
              month: 'long',
            })
            this.time = new Date(dateTime).toLocaleString("en-US", {
              timeZone: 'Asia/Kolkata',
              hour: '2-digit',
              minute: '2-digit',
            })
            this.notificationInfo[i].date = this.date;
            this.notificationInfo[i].time = this.time;
          }



          this.paginationValues.next({ type: 'page-init', page: params.page, totalTableRecords: res.countNotification });
          return resolve(true);
        }
      });
    });
  }



  notificationAddUpdate() {
    if (this.notificationForm.valid) {
      if (this.updateMode) {
        this.notificationService.updateNotification(this.notificationForm.value).subscribe((res: any) => {
          if (res) {
            this.successDone();
            this.successMsg = res;
          }
        }, err => {
          this.errorCheck = true;
          this.errorMsg = err.error;
        })
      } else {
        this.notificationService.addNotification(this.notificationForm.value).subscribe((res: any) => {
          if (res) {
            this.successDone();
            this.successMsg = res;
          }
        }, err => {
          this.errorCheck = true;
          this.errorMsg = err.error;
        })
      }
    }
  }

  notificationDelete(id: String) {
    this.notificationService.deleteNotification(id).subscribe((res: any) => {
      if (res) {
        this.successDone();
        this.successMsg = res;
        this.deleteById = '';
      }
    })
  }

}
