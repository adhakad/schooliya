import { Component, OnInit } from '@angular/core';
import { SchoolService } from 'src/app/services/school.service';
import { environment } from 'src/environments/environment';
import { AdminAuthService } from 'src/app/services/auth/admin-auth.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  public schoolName = environment.SCHOOL_NAME;
  currentYear: any;
  schoolInfo:any;
  facebook!:string;
  linkedin!:string;
  instagram!:string;
  youtube!:string;
  softwareCompanyLink:string='https://schooliya.in';
  adminId!:any;
  constructor(private schoolService:SchoolService,private adminAuthService:AdminAuthService) { }

  ngOnInit(): void {
    let getAdmin = this.adminAuthService.getLoggedInAdminInfo();
    this.adminId = getAdmin?.id;
    this.getSchool();
    this.currentYear = (new Date()).getFullYear();
  }
  socialMediaRedirect(link:string){
    const sanitizedLink = encodeURI(link);
    window.location.href = sanitizedLink;
  }
  softwareCompany(link:string){
    const sanitizedLink = encodeURI(link);
    window.location.href = sanitizedLink;
  }
  getSchool(){
    this.schoolService.getSchool(this.adminId).subscribe((res:any)=> {
      if(res){
        this.schoolInfo = res;
        this.facebook = res.facebookLink;
        this.linkedin = res.linkedinLink;
        this.instagram = res.instagramLink;
        this.youtube = res.youtubeLink;
        
      }
    })
  }

}
