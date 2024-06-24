import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdmitCardService } from 'src/app/services/admit-card.service';
@Component({
  selector: 'app-teacher-admit-card',
  templateUrl: './teacher-admit-card.component.html',
  styleUrls: ['./teacher-admit-card.component.css']
})
export class TeacherAdmitCardComponent implements OnInit {

  allAdmitCards: any[] = [];
  cls: any;
  admitCardInfo: any;
  studentInfo: any;
  loader:Boolean=true;
  constructor(public activatedRoute: ActivatedRoute, private admitCardService: AdmitCardService) {

  }

  ngOnInit(): void {
    this.cls = this.activatedRoute.snapshot.paramMap.get('id');
    this.getStudentAdmitCardByClass(this.cls);
  }



  getStudentAdmitCardByClass(cls: any) {
    this.admitCardService.getAllStudentAdmitCardByClass(cls).subscribe((res: any) => {
      if (res) {
        this.admitCardInfo = res.admitCardInfo;
        this.studentInfo = res.studentInfo;
        const studentInfoMap = new Map();
        this.studentInfo.forEach((item: any) => {
          studentInfoMap.set(item._id, item);
        });
        
        const combinedData = this.admitCardInfo.reduce((result: any, admitCard: any) => {
          const studentInfo = studentInfoMap.get(admitCard.studentId);
        
          if (studentInfo) {
            result.push({
              studentId: admitCard.studentId,
              class: admitCard.class,
              examType: admitCard.examType,
              status: admitCard.status || "",
              name: studentInfo.name,
              rollNumber: studentInfo.rollNumber,
              admissionNo: studentInfo.admissionNo
            });
          }
        
          return result;
        }, []);
        if (combinedData) {
          this.allAdmitCards = combinedData;
          setTimeout(()=>{
            this.loader = false;
          },1000)
        }
      }
    })
  }

  changeStatus(id: any, statusValue: any) {
    if (id) {
      let params = {
        id: id,
        statusValue: statusValue,
      }
      this.admitCardService.changeStatus(params).subscribe((res: any) => {
        if(res){
          this.getStudentAdmitCardByClass(this.cls);
        }
      })
    }
  }

}
