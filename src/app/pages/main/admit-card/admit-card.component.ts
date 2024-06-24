import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdmitCardService } from 'src/app/services/admit-card.service';
import { ClassService } from 'src/app/services/class.service';
import { PrintPdfService } from 'src/app/services/print-pdf/print-pdf.service';
import { SchoolService } from 'src/app/services/school.service';
import { AdminAuthService } from 'src/app/services/auth/admin-auth.service';

@Component({
  selector: 'app-admit-card',
  templateUrl: './admit-card.component.html',
  styleUrls: ['./admit-card.component.css']
})
export class AdmitCardComponent implements OnInit {
  @ViewChild('content') content!: ElementRef;
  errorMsg: string = '';
  admitCardForm: FormGroup;
  schoolInfo: any;
  classInfo: any;
  studentAdmitCardInfo: any;
  admitCardInfo: any;
  processedData: any[] = [];
  loader: Boolean = false;
  adminId!:any;
  constructor(private fb: FormBuilder,private adminAuthService:AdminAuthService, private schoolService: SchoolService, private printPdfService: PrintPdfService, private admitCardService: AdmitCardService, private classService: ClassService) {
    this.admitCardForm = this.fb.group({
      schoolId: ['', [Validators.required, Validators.maxLength(10)]],
      admissionNo: ['', Validators.required],
      class: ['', Validators.required],
      rollNumber: ['', Validators.required],
    })
  }
  ngOnInit(): void {
    let getAdmin = this.adminAuthService.getLoggedInAdminInfo();
    this.adminId = getAdmin?.id;
    this.getClass();
    this.getSchool();
  }
  
  printContent() {
    this.printPdfService.printElement(this.content.nativeElement);
  }

  downloadPDF() {
    this.printPdfService.generatePDF(this.content.nativeElement, "Admitcard.pdf");
  }
  getSchool() {
    this.schoolService.getSchool(this.adminId).subscribe((res: any) => {
      if (res) {
        this.schoolInfo = res;
      }
    })
  }
  getClass() {
    this.classService.getClassList().subscribe((res: any) => {
      if (res) {
        this.classInfo = res;
      }
    })
  }
  admitCard() {
    this.admitCardService.singleStudentAdmitCard(this.admitCardForm.value).subscribe((res: any) => {
      if (res) {
        this.loader=true;
        if (!this.processedData || !this.studentAdmitCardInfo || !this.admitCardInfo) {
          this.studentAdmitCardInfo = { ...res.studentInfo, ...res.admitCard };
          this.admitCardInfo = res.admitCardStructure;
          this.processData();
        }

      }
    }, err => {
      this.errorMsg = err.error.errorMsg;
    })
  }
  processData() {
    for (let i = 0; i < this.admitCardInfo.examDate.length; i++) {
      const subject = Object.keys(this.admitCardInfo.examDate[i])[0];
      const date = Object.values(this.admitCardInfo.examDate[i])[0];
      const startTime = Object.values(this.admitCardInfo.examStartTime[i])[0];
      const endTime = Object.values(this.admitCardInfo.examEndTime[i])[0];

      this.processedData.push({
        subject,
        date,
        timing: `${startTime} to ${endTime}`
      });
    }
    setTimeout(() => {
      this.loader = false;
    }, 1500)

  }

}
