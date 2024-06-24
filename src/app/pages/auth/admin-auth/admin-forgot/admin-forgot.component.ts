import { Component, ElementRef, ViewChild, OnInit, Renderer2, Directive, HostListener, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthService } from 'src/app/services/auth/admin-auth.service';


@Component({
  selector: 'app-admin-forgot',
  templateUrl: './admin-forgot.component.html',
  styleUrls: ['./admin-forgot.component.css']
})
export class AdminForgotComponent implements OnInit {
  errorMsg: string = '';
  successMsg: String = '';
  forgotForm: FormGroup;
  otpForm: FormGroup;
  resetForm: FormGroup;
  formType: String = 'Forgot';
  email: any;
  varifiedAdminInfo: any;
  constructor(private fb: FormBuilder, private router: Router, private adminAuthService: AdminAuthService,) {
    this.forgotForm = this.fb.group({
      email: ['', Validators.required],
    })
    this.otpForm = this.fb.group({
      email: [''],
      otp: [''],
      digit1: ['', Validators.required],
      digit2: ['', Validators.required],
      digit3: ['', Validators.required],
      digit4: ['', Validators.required],
      digit5: ['', Validators.required],
      digit6: ['', Validators.required]
    });
    this.resetForm = this.fb.group({
      email: [''],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
    })
  }

  ngOnInit(): void {
  }

  forgotPassword() {
    if (this.forgotForm.valid) {
      this.adminAuthService.forgotPassword(this.forgotForm.value).subscribe((res: any) => {
        if (res) {
          this.errorMsg = '';
          this.email = res.email;
          this.formType = 'VarifyOTP';
        }
      }, err => {
        this.errorMsg = err.error.errorMsg;
      })
    }
  }

  submitOtp() {
    const otp = `${this.otpForm.value.digit1}${this.otpForm.value.digit2}${this.otpForm.value.digit3}${this.otpForm.value.digit4}${this.otpForm.value.digit5}${this.otpForm.value.digit6}`;
    this.otpForm.value.email = this.email;
    this.otpForm.value.otp = otp;
    if (this.otpForm.value.email && this.otpForm.value.otp) {
      this.adminAuthService.varifyOTP(this.otpForm.value).subscribe((res: any) => {
        if (res) {
          this.errorMsg = '';
          this.email = res.adminInfo.email;
          this.formType = 'Reset';
        }

      }, err => {
        this.errorMsg = err.error.errorMsg;
      })
    }
  }

  passwordReset() {
    this.resetForm.value.email = this.email;
    this.adminAuthService.passwordReset(this.resetForm.value).subscribe((res: any) => {
      if (res) {
        this.errorMsg = '';
        // this.email = res.email;
        // this.formType = 'ResetSuccsess';
        // if (this.formType == 'ResetSuccsess') {
        //   this.successMsg = res.successMsg;
          this.router.navigate(["/admin/login"], { replaceUrl: true });
        // }
      }
    }, err => {
      this.errorMsg = err.error.errorMsg;
    })
  }

  @HostListener('input', ['$event']) onInput(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const maxLength = parseInt(input.getAttribute('maxlength') || '1');
    if (input.value.length >= maxLength) {
      const nextInput = input.nextElementSibling as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const previousInput = input.previousElementSibling as HTMLInputElement;

    if (event.key === 'Backspace' && !input.value) {
      if (previousInput) {
        previousInput.focus();
      }
    }
  }

}
