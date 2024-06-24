import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ExamResultService } from 'src/app/services/exam-result.service';
import { ClassService } from 'src/app/services/class.service';
import { PrintPdfService } from 'src/app/services/print-pdf/print-pdf.service';
import { SchoolService } from 'src/app/services/school.service';
import { AdminAuthService } from 'src/app/services/auth/admin-auth.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  @ViewChild('content') content!: ElementRef;
  errorMsg: string = '';
  examResultForm: FormGroup;
  schoolInfo: any;
  classInfo: any;
  studentInfo: any;
  examResultInfo: any;
  loader: Boolean = false;
  adminId!: any;
  constructor(private fb: FormBuilder, private adminAuthService: AdminAuthService, private schoolService: SchoolService, private printPdfService: PrintPdfService, private examResultService: ExamResultService, private classService: ClassService) {
    this.examResultForm = this.fb.group({
      schoolId: ['100001', [Validators.required, Validators.maxLength(10)]],
      admissionNo: ['51072900', Validators.required],
      class: ['12', Validators.required],
      rollNumber: ['324567300', Validators.required],
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
    this.printPdfService.generatePDF(this.content.nativeElement, "Result.pdf");
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

  examResult() {
    this.loader = true;
    this.examResultService.singleStudentExamResult(this.examResultForm.value).subscribe((res: any) => {
      if (res) {
        this.examResultInfo = res.examResult;
        this.studentInfo = res.studentInfo;
        this.loader = false;
      }
    }, (err: any) => {
      this.errorMsg = err.error.errorMsg;
    });

  }

}