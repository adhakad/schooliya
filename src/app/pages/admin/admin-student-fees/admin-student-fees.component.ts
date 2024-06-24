import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Subject } from 'rxjs';
import { read, utils, writeFile } from 'xlsx';
import { FeesService } from 'src/app/services/fees.service';
import { MatRadioChange } from '@angular/material/radio';
import { AdminAuthService } from 'src/app/services/auth/admin-auth.service';
import { FeesStructureService } from 'src/app/services/fees-structure.service';
import { PrintPdfService } from 'src/app/services/print-pdf/print-pdf.service';
import { SchoolService } from 'src/app/services/school.service';

@Component({
  selector: 'app-admin-student-fees',
  templateUrl: './admin-student-fees.component.html',
  styleUrls: ['./admin-student-fees.component.css']
})
export class AdminStudentFeesComponent implements OnInit {
  @ViewChild('receipt') receipt!: ElementRef;
  feesForm: FormGroup;
  showModal: boolean = false;
  updateMode: boolean = false;
  deleteMode: boolean = false;
  deleteById: String = '';
  successMsg: String = '';
  errorMsg: String = '';
  errorCheck: Boolean = false;
  feesInfo: any[] = [1, 2, 3, 4, 5];
  recordLimit: number = 10;
  filters: any = {};
  number: number = 0;
  paginationValues: Subject<any> = new Subject();
  page: Number = 0;
  cls: any;
  classSubject: any;
  showBulkFeesModal: boolean = false;
  movies: any[] = [];
  selectedValue: number = 0;
  fileChoose: boolean = false;
  existRollnumber: number[] = [];
  clsFeesStructure: any;

  schoolInfo: any;
  studentList: any[] = [];
  singleStudent: any;
  paybleInstallment: any;
  payNow: boolean = false;
  receiptInstallment: any = {};
  receiptMode: boolean = false;
  loader: Boolean = true;
  adminId!: string;
  constructor(private fb: FormBuilder, public activatedRoute: ActivatedRoute, private adminAuthService: AdminAuthService, private schoolService: SchoolService, private printPdfService: PrintPdfService, private feesService: FeesService, private feesStructureService: FeesStructureService) {
    this.feesForm = this.fb.group({
      adminId: [''],
      class: [''],
      studentId: [''],
      feesAmount: [''],
      createdBy: [''],
    });
  }



  ngOnInit(): void {
    this.getSchool();
    let getAdmin = this.adminAuthService.getLoggedInAdminInfo();
    this.adminId = getAdmin?.id;
    // this.getFees({ page: 1 });
    this.cls = this.activatedRoute.snapshot.paramMap.get('id');
    this.feesStructureByClass(this.cls);
    this.getAllStudentFeesCollectionByClass(this.cls);
  }

  printReceipt() {
    this.printPdfService.printElement(this.receipt.nativeElement);
    this.closeModal();
  }

  getSchool() {
    this.schoolService.getSchool(this.adminId).subscribe((res: any) => {
      if (res) {
        this.schoolInfo = res;
      }
    })
  }

  getAllStudentFeesCollectionByClass(cls: any) {
    let params = {
      class: cls,
      adminId: this.adminId,
    }
    this.feesService.getAllStudentFeesCollectionByClass(params).subscribe((res: any) => {
      if (res) {
        let studentFeesCollection = res.studentFeesCollection;
        let studentInfo = res.studentInfo;
        const studentMap: any = new Map(studentInfo.map((student: any) => [student._id, student]));
        const combinedData = studentFeesCollection.map((feeCollection: any) => ({
          ...studentMap.get(feeCollection.studentId),
          ...feeCollection
        }));

        this.studentList = combinedData;
        setTimeout(() => {
          this.loader = false;
        }, 1000)
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
        this.clsFeesStructure = res;
      }
    })
  }


  closeModal() {
    this.showModal = false;
    this.showBulkFeesModal = false;
    this.updateMode = false;
    this.successMsg = '';
    this.errorMsg = '';
    this.payNow = false;
    this.paybleInstallment = [];
    this.paybleInstallment = [0, 0];
    this.receiptInstallment = {};
    this.receiptMode = false;
    this.getAllStudentFeesCollectionByClass(this.cls)
  }
  feesPay(pay: boolean) {
    if (pay === false) {
      this.payNow = true;
    }
    if (pay === true) {
      this.payNow = false;
    }
  }
  studentFeesPay(student: any) {
    this.singleStudent = student;
    this.showModal = true;
    this.deleteMode = false;
    this.updateMode = false;
    this.feesForm.reset();

  }
  // updateFeesModel(fees: any) {
  //   this.showModal = true;
  //   this.deleteMode = false;
  //   this.updateMode = true;
  // }
  // deleteFeesModel(id: String) {
  //   this.showModal = true;
  //   this.updateMode = false;
  //   this.deleteMode = true;
  //   this.deleteById = id;
  // }


  // getFees($event: any) {
  //   this.page = $event.page
  //   return new Promise((resolve, reject) => {
  //     let params: any = {
  //       filters: {},
  //       page: $event.page,
  //       limit: $event.limit ? $event.limit : this.recordLimit,
  //       class: this.cls
  //     };
  //     this.recordLimit = params.limit;
  //     if (this.filters.searchText) {
  //       params["filters"]["searchText"] = this.filters.searchText.trim();
  //     }

  //     this.feesService.feesPaginationList(params).subscribe((res: any) => {
  //       if (res) {
  //         this.feesInfo = res.feesList;
  //         this.number = params.page;
  //         this.paginationValues.next({ type: 'page-init', page: params.page, totalTableRecords: res.countFees });
  //         return resolve(true);
  //       }
  //     });
  //   });
  // }

  feesAddUpdate() {
    if (this.feesForm.valid) {
      this.feesForm.value.adminId = this.adminId;
      if (this.updateMode) {
        // this.feesService.updateFees(this.feesForm.value).subscribe((res: any) => {
        //   if (res) {
        //     this.closeModal();
        //     this.successMsg = res;
        //   }
        // }, err => {
        //   this.errorCheck = true;
        //   this.errorMsg = err.error;
        // })
        console.log("this block is comment out");
      } else {
        this.feesForm.value.class = this.singleStudent.class;
        this.feesForm.value.createdBy = "Admin";
        this.feesForm.value.studentId = this.singleStudent.studentId;



        this.feesService.addFees(this.feesForm.value).subscribe((res: any) => {
          if (res) {
            this.receiptMode = true;
            this.receiptInstallment = res;
            if (res.admissionFeesPayable == true) {
              this.clsFeesStructure.feesType = [{ Admission: res.admissionFees }, ...this.clsFeesStructure.feesType];
            }
            if (res.admissionFeesPayable == false) {
              this.clsFeesStructure = this.clsFeesStructure;
            }
          }
        }, err => {
          this.errorCheck = true;
          this.errorMsg = err.error;
        })
      }
    }
  }



  // handleImport($event: any) {
  //   this.fileChoose = true;
  //   const files = $event.target.files;
  //   if (files.length) {
  //     const file = files[0];
  //     const reader = new FileReader();
  //     reader.onload = (event: any) => {
  //       const wb = read(event.target.fees);
  //       const sheets = wb.SheetNames;

  //       if (sheets.length) {
  //         const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
  //         this.movies = rows;
  //       }
  //     }
  //     reader.readAsArrayBuffer(file);
  //   }

  // }

  // onChange(event: MatRadioChange) {
  //   this.selectedValue = event.value;
  // }
  // addBulkFeesModel() {
  //   this.showBulkFeesModal = true;
  // }
  // addBulkFees() {
  //   this.feesService.addBulkFees(this.movies).subscribe((res: any) => {
  //     if (res) {
  //       this.successMsg = res;
  //     }
  //   }, err => {
  //     this.errorCheck = true;
  //     this.errorMsg = err.error.errMsg;
  //     this.existRollnumber = err.error.existRollnumber;
  //   })
  // }


}
