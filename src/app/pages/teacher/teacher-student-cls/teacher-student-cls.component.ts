import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { TeacherAuthService } from 'src/app/services/auth/teacher-auth.service';
import { ClassService } from 'src/app/services/class.service';
import { TeacherService } from 'src/app/services/teacher.service';


@Component({
  selector: 'app-teacher-student-cls',
  templateUrl: './teacher-student-cls.component.html',
  styleUrls: ['./teacher-student-cls.component.css']
})
export class TeacherStudentClsComponent implements OnInit {

  classInfo: any;
  id: any;
  teacherInfo: any;

  loader: Boolean = true;


  constructor(public activatedRoute: ActivatedRoute, private teacherAuthService: TeacherAuthService, private teacherService: TeacherService) { }

  ngOnInit(): void {
    this.teacherInfo = this.teacherAuthService.getLoggedInTeacherInfo();
    let teacherId = this.teacherInfo?.id;
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (teacherId) {
        this.getTeacherById(teacherId);
      }
    });
    setTimeout(() => {
      this.loader = false;
    }, 1000)
  }
  getTeacherById(id: string) {
    this.teacherService.getTeacherById(id).subscribe((res: any) => {
      if (res) {
        if (this.id == 'admission') {
          if (res.admissionPermission.status == true && res.admissionPermission.classes[0] > 0) {
            this.classInfo = [...res.admissionPermission.classes];
          }else{
            this.classInfo = [];
          }
        }
        if (this.id == 'student') {
          if (res.studentPermission.status == true && res.studentPermission.classes[0] > 0) {
            this.classInfo = [...res.studentPermission.classes];
          }else{
            this.classInfo = [];
          }
        }
        if (this.id == 'admit-card') {
          if (res.admitCardPermission.status == true && res.admitCardPermission.classes[0] > 0 ) {
            this.classInfo = [...res.admitCardPermission.classes];
          }else{
            this.classInfo = [];
          }
        }
        if (this.id == 'result') {
          if (res.resultPermission.status == true && res.resultPermission.classes[0] > 0) {
            this.classInfo = [...res.resultPermission.classes];
          }else{
            this.classInfo = [];
          }
        }
        if (this.id == 'fees') {
          if (res.feeCollectionPermission.status == true && res.feeCollectionPermission.classes[0] > 0) {
            this.classInfo = [...res.feeCollectionPermission.classes];
          }else{
            this.classInfo = [];
          }
        }
      }
    })
  }
}
