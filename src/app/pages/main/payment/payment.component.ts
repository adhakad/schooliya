import { Component, ElementRef, ViewChild, OnInit, Renderer2, Directive, HostListener, AfterViewInit } from '@angular/core';
declare var Razorpay: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { AdminAuthService } from 'src/app/services/auth/admin-auth.service';
import { PlansService } from 'src/app/services/plans.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  signupForm: FormGroup;
  otpForm: FormGroup;
  loader: Boolean = true;
  successMsg: String = '';
  errorMsg: string = '';
  check: boolean = false;
  paymentCompleted:Boolean=false;
  classInfo: any;
  adminInfo: any;
  getOTP: Boolean = true;
  varifyOTP: Boolean = false;
  email: any;
  verified: Boolean = false;
  id: any;
  singlePlanInfo: any;
  taxes: any;
  totalAmount: any;
  constructor(private fb: FormBuilder, private router: Router, private el: ElementRef, private renderer: Renderer2, public activatedRoute: ActivatedRoute, private paymentService: PaymentService, public plansService: PlansService, public adminAuthService: AdminAuthService) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')]],
      mobile: ['', [Validators.required, Validators.pattern('^[6789]\\d{9}$')]],
      city: ['', [Validators.required, Validators.maxLength(50)]],
      state: ['', [Validators.required, Validators.maxLength(50)]],
      address: ['', [Validators.required, Validators.maxLength(100)]],
      pinCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      schoolName: ['', [Validators.required, Validators.maxLength(50)]],
      affiliationNumber: ['', [Validators.required, Validators.maxLength(15)]],
    });
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
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id) {
      this.getSinglePlans(this.id);
    }
    this.loadRazorpayScript();
    setTimeout(() => {
      this.loader = false;
    }, 1000)
  }
  loadRazorpayScript(): void {
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
    };
    this.renderer.appendChild(this.el.nativeElement, script);
  }
  getSinglePlans(id: any) {
    this.plansService.getSinglePlans(id).subscribe((res: any) => {
      if (res) {
        let price = parseInt(res.price);
        this.taxes = price * 18 / 100;
        this.totalAmount = price + this.taxes;
        this.singlePlanInfo = res;
      }
    })
  }
  signup() {
    this.adminAuthService.signup(this.signupForm.value).subscribe((res: any) => {
      if (res) {
        this.errorMsg = '';
        this.email = res.email;
        this.getOTP = false;
        this.varifyOTP = true;
      }
    }, err => {
      this.errorMsg = err.error.errorMsg;
    })
  }

  submitOtp() {
    const otp = `${this.otpForm.value.digit1}${this.otpForm.value.digit2}${this.otpForm.value.digit3}${this.otpForm.value.digit4}${this.otpForm.value.digit5}${this.otpForm.value.digit6}`;
    this.otpForm.value.email = this.email;
    this.otpForm.value.otp = otp;
    if (this.otpForm.value.email && this.otpForm.value.otp) {
      this.adminAuthService.varifyOTP(this.otpForm.value).subscribe((res: any) => {
        if (res) {
          this.errorMsg = '';
          this.getOTP = false;
          this.varifyOTP = false;
          this.verified = res.verified;
          this.successMsg = res.successMsg;
          this.adminInfo = res.adminInfo;
        }

      }, err => {
        this.errorMsg = err.error.errorMsg;
      })
    }
  }

  createPayment() {
    const adminId = this.adminInfo._id;
    const amount = this.totalAmount;
    const activePlan = this.singlePlanInfo.plans;
    const currency = 'INR';
    const paymentData = { adminId: adminId, activePlan: activePlan, amount: amount, currency: currency };
    this.paymentService.createPayment(paymentData).subscribe(
      (response: any) => {
        const options = {
          key: 'rzp_test_ARoUa9Hxw3scSz',
          amount: response.order.amount,
          currency: response.order.currency,
          name: 'Schooliya',
          description: 'Payment for Your Product',
          image: '../../../../assets/logo.png',
          prefill: {
            name: this.adminInfo.name,
            email: this.adminInfo.email,
            contact: '9340700360',
            method: 'online'
          },
          theme: {
            color: '#8d6dff',
          },
          order_id: response.order.id,
          handler: this.paymentHandler.bind(this),
        };
        Razorpay.open(options);
      },
      (error) => {
        this.errorMsg = 'Payment creation failed. Please try again later.';
      }
    );
  }

  paymentHandler(response: any) {
    const razorpayPaymentId = response.razorpay_payment_id;
    const razorpayOrderId = response.razorpay_order_id;
    const razorpaySignature = response.razorpay_signature;
    const paymentData = {
      payment_id: razorpayPaymentId,
      order_id: razorpayOrderId,
      signature: razorpaySignature,
      email: this.adminInfo.email,
      id: this.adminInfo._id,
    }
    this.paymentService.validatePayment(paymentData).subscribe((validationResponse: any) => {
      if (validationResponse) {
        this.paymentCompleted = true;
        this.adminAuthService.deleteAllCookies();
        this.successMsg = validationResponse.message;
        this.getOTP = false;
        this.varifyOTP = false;
        this.verified = false;
        this.successMsg = '';
        this.errorMsg = '';
        this.adminAuthService.deleteAllCookies();
        const accessToken = validationResponse.accessToken;
        const refreshToken = validationResponse.refreshToken;
        this.adminAuthService.storeAccessToken(accessToken);
        this.adminAuthService.storeRefreshToken(refreshToken);
        this.router.navigate(["/admin/dashboard"], { replaceUrl: true });
        this.router.navigate(["/admin/dashboard"], { replaceUrl: true });

      }
    },
      (validationError: any) => {
        this.errorMsg = 'Payment validation failed. Please contact support.';
      }
    );
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