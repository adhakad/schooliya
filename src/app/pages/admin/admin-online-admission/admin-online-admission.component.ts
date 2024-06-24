import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StudentService } from 'src/app/services/student.service';
@Component({
  selector: 'app-admin-online-admission',
  templateUrl: './admin-online-admission.component.html',
  styleUrls: ['./admin-online-admission.component.css']
})
export class AdminOnlineAdmissionComponent implements OnInit {

  public baseUrl = environment.API_URL;
  admissionEnquiryForm: FormGroup;
  showModal: boolean = false;
  updateMode: boolean = false;
  deleteMode: boolean = false;
  deleteById: String = '';
  successMsg: String = '';
  errorMsg: String = '';
  errorCheck: Boolean = false;
  admissionEnquiryInfo: any = [];
  rollNumberType: string = '';

  recordLimit: number = 5;
  filters: any = {};
  number: number = 0;
  paginationValues: Subject<any> = new Subject();
  loader:Boolean=true;
  constructor(private fb: FormBuilder, private studentService: StudentService) {
    this.admissionEnquiryForm = this.fb.group({
      _id: [''],
      session: ['', Validators.required],
      admissionNo: ['', Validators.required],
      class: ['', Validators.required],
      stream: ['', Validators.required],
      admissionFees: [''],
      admissionFeesPaymentType: [''],
      rollNumberType: ['', Validators.required],
      rollNumber: ['', Validators.required],
      name: ['', Validators.required],
      dob: ['', Validators.required],
      aadharNumber:['',[Validators.required, Validators.pattern('^\\d{12}$')]],
      samagraId:['',[Validators.required, Validators.pattern('^\\d{9}$')]],
      gender: ['', Validators.required],
      category: ['', Validators.required],
      religion: ['', Validators.required],
      nationality: ['', Validators.required],
      contact: ['', Validators.required],
      address: ['', Validators.required],
      lastSchool: [''],
      fatherName: ['', Validators.required],
      fatherQualification: ['', Validators.required],
      fatherOccupation: ['', Validators.required],
      fatherContact: ['', Validators.required],
      fatherAnnualIncome: ['', Validators.required],
      motherName: ['', Validators.required],
      motherQualification: ['', Validators.required],
      motherOccupation: ['', Validators.required],
      motherContact: ['', Validators.required],
      motherAnnualIncome: ['', Validators.required],
      status:[''],
      createdBy:[''],
    })
  }

  ngOnInit(): void {
    let load:any = this.getAdmissionEnquiry({ page: 1 });
    if(load){
      setTimeout(()=>{
        this.loader = false;
      },1000)
    }
  }

  chooseRollNumberType(event: any) {
    if (event) {
      if (event.value == 'generate') {
        this.rollNumberType = event.value;
        const rollNumber = Math.floor(Math.random() * 89999999 + 10000000);
        this.admissionEnquiryForm.get('rollNumber')?.setValue(rollNumber);

      }
      if (event.value == 'manualFill') {
        this.rollNumberType = event.value;
        this.admissionEnquiryForm.get('rollNumber')?.setValue(null);
      }
    }
  }

  getAdmissionEnquiry($event: any) {
    return new Promise((resolve, reject) => {
      let params: any = {
        filters: {},
        page: $event.page,
        limit: $event.limit ? $event.limit : this.recordLimit
      };
      this.recordLimit = params.limit;
      if (this.filters.searchText) {
        params["filters"]["searchText"] = this.filters.searchText.trim();
      }

      this.studentService.studentAdmissionEnquiryPagination(params).subscribe((res: any) => {
        if (res) {
          this.admissionEnquiryInfo = res.admissionEnquiryList;

          this.number = params.page;
          this.paginationValues.next({ type: 'page-init', page: params.page, totalTableRecords: res.countAdmissionEnquiry });
          return resolve(true);
        }
      });
    });
  }

  closeModal() {
    this.showModal = false;
    this.updateMode = false;
    this.deleteMode = false;
    this.errorMsg = '';
    this.admissionEnquiryForm.reset();
  }

  updateAdmissionEnquiryModel(admissionEnquiry: any) {
    this.showModal = true;
    this.deleteMode = false;
    this.updateMode = true;
    const admissionNo = Math.floor(Math.random() * 89999999 + 10000000);
    this.admissionEnquiryForm.get('admissionNo')?.setValue(admissionNo);
    this.admissionEnquiryForm.patchValue(admissionEnquiry);
  }
  deleteAdmissionEnquiryModel(id: String) {
    this.showModal = true;
    this.updateMode = false;
    this.deleteMode = true;
    this.deleteById = id;
  }

  successDone() {
    setTimeout(() => {
      this.closeModal();
      this.successMsg = '';
      this.getAdmissionEnquiry({ page: 1 });
    }, 1000)
  }
  admissionEnquiryAddUpdate() {
    if (this.admissionEnquiryForm.valid) {
      if (this.updateMode) {
        this.admissionEnquiryForm.value.admissionType = 'New';
        this.admissionEnquiryForm.value.createdBy = 'Admin';
        this.admissionEnquiryForm.value.admissionFeesPaymentType = 'Later';
        this.admissionEnquiryForm.value.admissionFees = 0;
        this.admissionEnquiryForm.value.status = 'Complete';
        this.studentService.addStudent(this.admissionEnquiryForm.value).subscribe((res: any) => {
          if (res) {
            
            this.successDone();
            this.successMsg = res.successMsg;
          }
        }, err => {
          this.errorCheck = true;
          this.errorMsg = err.error;
        })
      }
    }
  }

  admissionEnquiryDelete(id: String) {
    this.studentService.deletedeleteAdmissionEnquiry(id).subscribe((res: any) => {
      if (res) {
        this.successDone();
        this.successMsg = res;
        this.deleteById = '';
      }
    })
  }

}
