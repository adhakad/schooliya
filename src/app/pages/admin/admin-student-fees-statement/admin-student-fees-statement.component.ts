import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FeesStructureService } from 'src/app/services/fees-structure.service';
import { FeesService } from 'src/app/services/fees.service';
import { PrintPdfService } from 'src/app/services/print-pdf/print-pdf.service';
import { AdminAuthService } from 'src/app/services/auth/admin-auth.service';
import { SchoolService } from 'src/app/services/school.service';

@Component({
  selector: 'app-admin-student-fees-statement',
  templateUrl: './admin-student-fees-statement.component.html',
  styleUrls: ['./admin-student-fees-statement.component.css']
})
export class AdminStudentFeesStatementComponent implements OnInit {
  @ViewChild('content') content!: ElementRef;
  @ViewChild('receipt') receipt!: ElementRef;
  cls: any;
  showModal: boolean = false;
  clsFeesStructure: any;
  studentFeesCollection: any;
  studentId: any;
  processedData: any[] = [];
  singleReceiptInstallment: any[] = [];
  studentInfo: any[] = [];
  schoolInfo: any;
  loader: Boolean = true;
  adminId!: string;
  constructor(public activatedRoute: ActivatedRoute, private adminAuthService: AdminAuthService, private schoolService: SchoolService, private printPdfService: PrintPdfService, private feesService: FeesService, private feesStructureService: FeesStructureService) { }

  ngOnInit(): void {
    this.getSchool();
    let getAdmin = this.adminAuthService.getLoggedInAdminInfo();
    this.adminId = getAdmin?.id;
    this.cls = this.activatedRoute.snapshot.paramMap.get('class');
    this.studentId = this.activatedRoute.snapshot.paramMap.get('id');
    this.singleStudentFeesCollectionById(this.studentId)
  }
  getSchool() {
    this.schoolService.getSchool(this.adminId).subscribe((res: any) => {
      if (res) {
        this.schoolInfo = res;
      }
    })
  }
  printContent() {
    this.printPdfService.printElement(this.content.nativeElement);
  }

  downloadPDF() {
    this.printPdfService.generatePDF(this.content.nativeElement, "Fee-statement.pdf");
  }
  printReceipt() {
    this.printPdfService.printElement(this.receipt.nativeElement);
  }

  downloadReceiptPDF() {
    this.printPdfService.generatePDF(this.receipt.nativeElement, "Fee-receipt.pdf");
  }
  closeModal() {
    this.showModal = false;

  }
  feeReceipt(singleInstallment: any) {
    const data: any = this.processedData
    const desiredInstallment = singleInstallment;
    this.singleReceiptInstallment = data.filter((item: any) => item.paymentDate === desiredInstallment);
    this.singleReceiptInstallment[0].discountAmountInFees = this.studentFeesCollection.discountAmountInFees;
    this.showModal = true;

  }
  singleStudentFeesCollectionById(studentId: any) {
    this.feesService.singleStudentFeesCollectionById(studentId).subscribe((res: any) => {
      if (res) {
        this.studentFeesCollection = res.studentFeesCollection;
        this.studentInfo = res.studentInfo;
        this.feesStructureByClass(this.cls);
        this.processData();
      }
    })
  }

  feesStructureByClass(cls: any) {
    let params = {
      class: cls,
      adminId: this.adminId,
    }
    this.feesStructureService.feesStructureByClass(params).subscribe((res: any) => {
      if (res) {
        if (this.studentFeesCollection.admissionFeesPayable == true) {
          res.feesType = [{ Admission: res.admissionFees }, ...res.feesType];
          this.clsFeesStructure = res;
        }
        if (this.studentFeesCollection.admissionFeesPayable == false) {
          this.clsFeesStructure = res;
        }
      }
    })
  }

  processData() {
    let allPaidAmount = this.studentFeesCollection.admissionFees; 
    for (let i = 0; i < this.studentFeesCollection.installment.length; i++) {
      const receiptNo = this.studentFeesCollection.receipt[i];
      const paidAmount: any = this.studentFeesCollection.installment[i];
      const paymentDate = this.studentFeesCollection.paymentDate[i];
      const createdBy = this.studentFeesCollection.createdBy[i];
      allPaidAmount += paidAmount;
      this.processedData.push({
        allPaidAmount,
        receiptNo,
        paidAmount,
        paymentDate,
        createdBy
      });
    }
    setTimeout(() => {
      this.loader = false;
    }, 1000);
  }
}
