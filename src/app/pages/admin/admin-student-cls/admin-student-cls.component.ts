import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { ClassService } from 'src/app/services/class.service';

@Component({
  selector: 'app-admin-student-cls',
  templateUrl: './admin-student-cls.component.html',
  styleUrls: ['./admin-student-cls.component.css']
})
export class AdminStudentClsComponent implements OnInit {

  classInfo:any;
  id:any;
  loader:Boolean=true;
  constructor(public activatedRoute:ActivatedRoute,private classService:ClassService) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = params.get('id');
    });
    this.getClass();
  }
  getClass(){
    this.classService.getClassList().subscribe((res:any)=>{
      if(res){
        this.classInfo = res;
        setTimeout(()=>{
          this.loader = false;
        },1000)
      }
    })
  }
}

