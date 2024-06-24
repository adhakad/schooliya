import { Component, OnInit } from '@angular/core';
import { SchoolService } from 'src/app/services/school.service';
import { AdminAuthService } from 'src/app/services/auth/admin-auth.service';

@Component({
  selector: 'app-refund-cancellation-policy',
  templateUrl: './refund-cancellation-policy.component.html',
  styleUrls: ['./refund-cancellation-policy.component.css']
})
export class RefundCancellationPolicyComponent implements OnInit {

  schoolInfo:any;
  loader:Boolean=true;
  adminId!:any;
  constructor(private schoolService:SchoolService,private adminAuthService:AdminAuthService) { }

  ngOnInit(): void {
    let getAdmin = this.adminAuthService.getLoggedInAdminInfo();
    this.adminId = getAdmin?.id;
    this.getSchool();
  }
  getSchool(){
    this.schoolService.getSchool(this.adminId).subscribe((res:any)=>{
      if(res){
        this.schoolInfo = res;
        setTimeout(() => {
          this.loader = false;
        }, 1000)
      }
    })
  }

}
