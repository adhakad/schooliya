import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClassService } from 'src/app/services/class.service';


@Component({
  selector: 'app-admin-setting-cls',
  templateUrl: './admin-setting-cls.component.html',
  styleUrls: ['./admin-setting-cls.component.css']
})
export class AdminSettingClsComponent implements OnInit {

  classInfo:any;
  id:any;
  loader:Boolean = true;
  constructor(public activatedRoute:ActivatedRoute,private classService:ClassService) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getClass();
  }
  getClass(){
    this.classService.getClassList().subscribe((res:any)=>{
      if(res){
        this.classInfo = res
        setTimeout(()=>{
          this.loader = false;
        },1000)
      }
    })
  }
}
