import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentAuthService } from 'src/app/services/auth/student-auth.service';
import { ClassService } from 'src/app/services/class.service';
@Component({
  selector: 'app-student-forgot',
  templateUrl: './student-forgot.component.html',
  styleUrls: ['./student-forgot.component.css']
})
export class StudentForgotComponent implements OnInit {
  errorMsg: string = '';
  successMsg: String = '';
  varifyForm: FormGroup;
  otpForm: FormGroup;
  resetForm: FormGroup;
  formType: String = 'Varify';
  classInfo: any;
  varifiedStudentInfo:any;
  varifiedOtpInfo:any;
  constructor(private fb: FormBuilder, private router: Router, private classService: ClassService, private studentAuthService: StudentAuthService) {
    this.varifyForm = this.fb.group({
      rollNumber: ['', [Validators.required, Validators.maxLength(8),Validators.pattern('^[0-9]+$')]],
      class: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    })
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/),Validators.pattern('^[0-9]+$')]],
      rollNumber: [''],
      class: [''],
    })
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20),Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
      otp: [''],
      rollNumber: [''],
      class: [''],
    })
      
  }
  ngOnInit(): void {
    this.getClass();
  }

  getClass() {
    this.classService.getClassList().subscribe((res) => {
      this.classInfo = res;
    })
  }


  studentVarify() {
    if (this.varifyForm.valid) {
      this.studentAuthService.studentVarify(this.varifyForm.value).subscribe((res: any) => {
        if (res) {
          this.errorMsg = '';
          this.varifiedStudentInfo = res.varifiedStudentInfo;
          this.formType = 'Otp';
        }
      }, err => {
        this.errorMsg = err.error;
      })
    }
  }
  otpVarify() {
    this.otpForm.value.class = this.varifiedStudentInfo.class;
    this.otpForm.value.rollNumber = this.varifiedStudentInfo.rollNumber;
    this.studentAuthService.otpVarify(this.otpForm.value).subscribe((res: any) => {
      if (res) {
        this.errorMsg = '';
        this.varifiedOtpInfo = res.varifiedOtpInfo;
        this.formType = 'Reset';
      }
    }, err => {
      this.errorMsg = err.error;
    })
  }
  usernamePasswordReset() {
    this.resetForm.value.class = this.varifiedOtpInfo.class;
    this.resetForm.value.rollNumber = this.varifiedOtpInfo.rollNumber;
    this.resetForm.value.otp = this.varifiedOtpInfo.otp;
    this.studentAuthService.usernamePasswordReset(this.resetForm.value).subscribe((res: any) => {
      if (res) {
        this.errorMsg = '';
        this.formType = 'ResetSuccsess';
        if(this.formType=='ResetSuccsess'){
          this.successMsg = res;
        }
      }
    }, err => {
      this.errorMsg = err.error;
    })
  }
}