import { Component, ElementRef, ViewChild, OnInit,Renderer2 } from '@angular/core';
declare var Razorpay: any;
import { Router } from '@angular/router';
import { StudentAuthService } from 'src/app/services/auth/student-auth.service';
import { FeesStructureService } from 'src/app/services/fees-structure.service';
import { FeesService } from 'src/app/services/fees.service';
import { PrintPdfService } from 'src/app/services/print-pdf/print-pdf.service';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { SchoolService } from 'src/app/services/school.service';
import { AdminAuthService } from 'src/app/services/auth/admin-auth.service';

@Component({
  selector: 'app-student-fees',
  templateUrl: './student-fees.component.html',
  styleUrls: ['./student-fees.component.css']
})
export class StudentFeesComponent implements OnInit {
  errorMessage: String = '';
  successMessage: String = '';
  cls: any;
  studentInfo: any[] = [];
  clsFeesStructure: any;
  studentFeesCollection: any;
  studentId: any;
  paybleInstallment: any[] = [];
  check: boolean = false;
  student:any;
  schoolInfo:any;
  loader:Boolean=true;
  adminId!:any;
  constructor(private adminAuthService:AdminAuthService,private renderer: Renderer2, private el: ElementRef,private schoolService:SchoolService, private paymentService: PaymentService, private studentAuthService: StudentAuthService, private printPdfService: PrintPdfService, private feesService: FeesService, private feesStructureService: FeesStructureService) { }

  ngOnInit(): void {
    let getAdmin = this.adminAuthService.getLoggedInAdminInfo();
    this.adminId = getAdmin?.id;
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';

    script.onload = () => {
      // console.log('Razorpay script has loaded successfully. You can now initiate payments.');
    };

    this.renderer.appendChild(this.el.nativeElement, script);
    this.getSchool();
    this.student = this.studentAuthService.getLoggedInStudentInfo();
    this.cls = this.student.class;
    this.studentId = this.student.id;
    this.feesStructureByClass(this.cls);
  }
  getSchool(){
    this.schoolService.getSchool(this.adminId).subscribe((res:any)=>{
      if(res){
        this.schoolInfo = res;
      }
    })
  }

  feesStructureByClass(cls: any) {
    this.feesStructureService.feesStructureByClass(cls).subscribe((res: any) => {
      if (res) {
        this.clsFeesStructure = res;
        if (this.clsFeesStructure) {
          this.singleStudentFeesCollectionById(this.studentId);
        }
      }
    })
  }
  singleStudentFeesCollectionById(studentId: any) {
    this.feesService.singleStudentFeesCollectionById(studentId).subscribe((res: any) => {
      if (res) {
        this.studentFeesCollection = res.studentFeesCollection;
        this.studentInfo = res.studentInfo;
        const installment = this.studentFeesCollection.installment;
        const result = installment.find((installment: any) => {
          const [key, value] = Object.entries(installment)[0];
          return value === 0;
        });
        if (this.clsFeesStructure && result) {
          let installmentName = Object.keys(result)[0];
          this.paybleInstallment = this.clsFeesStructure.installment.filter((item: any) => item[installmentName])
          this.check = true;
        }
        this.check = true;
        setTimeout(()=>{
          this.loader = false;
        },1000)
      }
    })
  }
  successDone() {
    setTimeout(() => {
      console.log("abcd")
      this.successMessage = 'ABCD';

    }, 1000)
  }
  createPayment() {
    const studentId = this.student.id;
    const cls = this.student.class;
    const feesInstallment = Object.keys(this.paybleInstallment[0])[0];
    const feesAmount = Object.values(this.paybleInstallment[0])[0];
    const currency = 'INR';
    const paymentData = { studentId: studentId, cls: cls, feesInstallment: feesInstallment, feesAmount: feesAmount, currency: currency };
    this.paymentService.createPayment(paymentData).subscribe(
      (response: any) => {
        const options = {
          key: 'rzp_test_ARoUa9Hxw3scSz',
          amount: response.order.feesAmount,
          currency: response.order.currency,
          name: this.schoolInfo?.schoolName,
          description: 'Payment for Your Product',
          image: '../../../../assets/logo.png',
          prefill: {
            name: this.student.name,
            email: this.student.email,
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
        this.paybleInstallment = ["abc"];
      },
      (error) => {
        this.errorMessage = 'Payment creation failed. Please try again later.';
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
      signature: razorpaySignature
    }
    this.paymentService.validatePayment(paymentData).subscribe((validationResponse: any) => {
      if (validationResponse) {
        this.successMessage = validationResponse.message;
      }
    },
      (validationError: any) => {
        this.errorMessage = 'Payment validation failed. Please contact support.';
      }
    );
  }
}