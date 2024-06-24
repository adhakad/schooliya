import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthService } from 'src/app/services/auth/admin-auth.service';
@Component({
  selector: 'app-admin-signup',
  templateUrl: './admin-signup.component.html',
  styleUrls: ['./admin-signup.component.css']
})
export class AdminSignupComponent implements OnInit {
  errorMsg: string = '';
  signupForm: FormGroup;
  classInfo:any;
  constructor(private fb: FormBuilder, public adminAuthService: AdminAuthService, private router: Router) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
    });
  }

  ngOnInit(): void {
  }

  signup() {
    if (this.signupForm.valid) {
      this.adminAuthService.signup(this.signupForm.value).subscribe((res: any) => {
        if (res) {
          this.router.navigate(['/admin/login']);
        }
      }, err => {
        this.errorMsg = err.error.errorMsg;
      })
    }
  }

}
