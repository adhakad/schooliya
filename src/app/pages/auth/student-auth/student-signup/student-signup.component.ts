import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentAuthService } from 'src/app/services/auth/student-auth.service';
import { ClassService } from 'src/app/services/class.service';
@Component({
  selector: 'app-student-signup',
  templateUrl: './student-signup.component.html',
  styleUrls: ['./student-signup.component.css']
})
export class StudentSignupComponent implements OnInit {
  errorMsg: string = '';
  signupForm: FormGroup;
  classInfo:any;
  constructor(private fb: FormBuilder, public studentAuthService: StudentAuthService, private router: Router,private classService:ClassService) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20),Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/),Validators.pattern('^[0-9]+$')]],
      rollNumber: ['', [Validators.required, Validators.maxLength(8),Validators.pattern('^[0-9]+$')]], // Maximum length of 8 characters
      class: ['', [Validators.required, Validators.pattern(/^\d+$/)]], // Numeric characters only
    });
  }
  ngOnInit(): void {
    this.getClass();
  }

  getClass(){
    this.classService.getClassList().subscribe((res) => {
      this.classInfo = res;
    })
  }

  signup() {
    if (this.signupForm.valid) {
      this.studentAuthService.signup(this.signupForm.value).subscribe((res: any) => {
        if (res) { 
          this.router.navigate(['/student/login']);
        }
      }, err => {
        this.errorMsg = err.error;
      })
    }
  }
}
