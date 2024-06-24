import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeacherAuthService } from 'src/app/services/auth/teacher-auth.service';
import { FeesStructureService } from 'src/app/services/fees-structure.service';
import { FeesService } from 'src/app/services/fees.service';
import { PrintPdfService } from 'src/app/services/print-pdf/print-pdf.service';
import { SchoolService } from 'src/app/services/school.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { AdminAuthService } from 'src/app/services/auth/admin-auth.service';

@Component({
  selector: 'app-teacher-student-fee-statement',
  templateUrl: './teacher-student-fee-statement.component.html',
  styleUrls: ['./teacher-student-fee-statement.component.css']
})
export class TeacherStudentFeeStatementComponent implements OnInit {

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
  teacherInfo:any;
  collectBy:String='';
  loader:Boolean=true;
  adminId!:any;
  constructor(private adminAuthService:AdminAuthService,public activatedRoute: ActivatedRoute, private schoolService: SchoolService,private teacherAuthService:TeacherAuthService,private teacherService:TeacherService,private printPdfService: PrintPdfService, private feesService: FeesService, private feesStructureService: FeesStructureService) { }

  ngOnInit(): void {
    let getAdmin = this.adminAuthService.getLoggedInAdminInfo();
    this.adminId = getAdmin?.id;
    this.getSchool();
    this.teacherInfo = this.teacherAuthService.getLoggedInTeacherInfo();
    if(this.teacherInfo){
      this.getTeacherById(this.teacherInfo.id)
    }
    this.cls = this.activatedRoute.snapshot.paramMap.get('class');
    this.studentId = this.activatedRoute.snapshot.paramMap.get('id');
    this.singleStudentFeesCollectionById(this.studentId)
  }
  getTeacherById(id:string){
    this.teacherService.getTeacherById(id).subscribe((res:any)=> {
      if(res){
        this.collectBy = `${res.name} (${res.teacherUserId})`;
      }

    })
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
    this.singleReceiptInstallment = Object.values(data).filter((item: any) => item.installment === desiredInstallment);
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
    this.feesStructureService.feesStructureByClass(cls).subscribe((res: any) => {
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
      const receiptNo = Object.values(this.studentFeesCollection.receipt[i])[0];
      const installment = Object.keys(this.studentFeesCollection.installment[i])[0];
      const paidAmount:any = Object.values(this.studentFeesCollection.installment[i])[0];
      const paymentDate = Object.values(this.studentFeesCollection.paymentDate[i])[0];
      const collectedBy = Object.values(this.studentFeesCollection.collectedBy[i])[0];
      allPaidAmount += paidAmount;
      this.processedData.push({
        allPaidAmount,
        receiptNo,
        installment,
        paidAmount,
        paymentDate,
        collectedBy
      });
    }
    setTimeout(()=>{
      this.loader = false;
    },1000);
  }

}
