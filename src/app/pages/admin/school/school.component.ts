import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SchoolService } from 'src/app/services/school.service';
import { AdminAuthService } from 'src/app/services/auth/admin-auth.service';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css']
})
export class SchoolComponent implements OnInit {

  schoolForm: FormGroup;
  showModal: boolean = false;
  updateMode: boolean = false;
  deleteMode: boolean = false;
  deleteById: String = '';
  successMsg: String = '';
  errorMsg: String = '';
  errorCheck: Boolean = false;
  schoolInfo: any;
  loader: Boolean = true;
  adminId!:String
  constructor(private fb: FormBuilder, private schoolService: SchoolService,private adminAuthService:AdminAuthService) {
    this.schoolForm = this.fb.group({
      _id: [''],
      adminId:[''],
      schoolName: ['', [Validators.required, Validators.maxLength(50)]],
      affiliationNumber: ['', [Validators.required, Validators.maxLength(15)]],
      schoolCode: ['', [Validators.required, Validators.maxLength(15)]],
      foundedYear: ['', [Validators.required, Validators.pattern(/^(19|20)\d{2}$/)]],
      board: ['', [Validators.required, Validators.maxLength(50)]],
      medium: ['', [Validators.required, Validators.maxLength(50)]],
      street: ['', [Validators.required, Validators.maxLength(100)]],
      city: ['', [Validators.required, Validators.maxLength(50)]],
      district: ['', [Validators.required, Validators.maxLength(50)]],
      state: ['', [Validators.required, Validators.maxLength(50)]],
      pinCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      phoneOne: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^\d+$/)]],
      phoneSecond: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^\d+$/)]],
      email: ['', [Validators.required, Validators.email]],
      facebookLink: ['', [Validators.pattern(/^(https?:\/\/)?(www\.)?facebook.com\/[a-zA-Z0-9(\.\?)?]/)]],
      linkedinLink: ['', [Validators.pattern(/^(https?:\/\/)?(www\.)?linkedin.com\/[a-zA-Z0-9(\.\?)?]/)]],
      instagramLink: ['', [Validators.pattern(/^(https?:\/\/)?(www\.)?instagram.com\/[a-zA-Z0-9(\.\?)?]/)]],
      youtubeLink: ['', [Validators.pattern(/^(https?:\/\/)?(www\.)?youtube.com\/[a-zA-Z0-9(\.\?)?]/)]],
    })
  }
  ngOnInit(): void {
    let getAdmin = this.adminAuthService.getLoggedInAdminInfo();
    this.adminId = getAdmin?.id;
    this.getSchool();
    setTimeout(() => {
      this.loader = false;
    }, 2000)
  }
  closeModal() {
    this.showModal = false;
    this.updateMode = false;
    this.deleteMode = false;
    this.errorMsg = '';
    this.schoolForm.reset();
  }
  addSchoolModel() {
    this.showModal = true;
    this.deleteMode = false;
    this.updateMode = false;
    this.schoolForm.reset();
  }
  updateSchoolModel(school: any) {
    this.showModal = true;
    this.deleteMode = false;
    this.updateMode = true;
    this.schoolForm.patchValue(school);
  }
  deleteSchoolModel(id: String) {
    this.showModal = true;
    this.updateMode = false;
    this.deleteMode = true;
    this.deleteById = id;
  }
  successDone() {
    setTimeout(() => {
      this.getSchool();
      this.closeModal();
      this.successMsg = '';
    }, 1500)
  }

  getSchool() {
    this.schoolService.getSchool(this.adminId).subscribe((res: any) => {
      if (res) {
        this.schoolInfo = res;
      }
    });
  }

  schoolAddUpdate() {
    if (this.schoolForm.valid) {
      this.schoolForm.value.adminId = this.adminId;
      if (this.updateMode) {
        this.schoolService.updateSchool(this.schoolForm.value).subscribe((res: any) => {
          if (res) {
            this.successDone();
            this.successMsg = res;
          }
        }, err => {
          this.errorCheck = true;
          this.errorMsg = err.error;
        })
      } else {
        this.schoolService.addSchool(this.schoolForm.value).subscribe((res: any) => {
          if (res) {
            this.successDone();
            this.successMsg = res;
          }
        }, err => {
          this.errorCheck = true;
          this.errorMsg = err.error;
        })
      }
    }
  }
  schoolDelete(id: String) {
    this.schoolService.deleteSchool(id).subscribe((res: any) => {
      if (res) {
        this.successDone();
        this.schoolInfo = '';
        this.successMsg = res;
        this.deleteById = '';
      }
    })
  }

}

