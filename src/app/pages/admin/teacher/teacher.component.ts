import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { AdminAuthService } from 'src/app/services/auth/admin-auth.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { Teacher } from 'src/app/modal/teacher.model';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {
  teacherForm: FormGroup;
  showModal: boolean = false;
  updateMode: boolean = false;
  deleteMode: boolean = false;
  deleteById: String = '';
  successMsg: String = '';
  errorMsg: String = '';
  errorCheck: Boolean = false;
  teacherInfo: Teacher[] = [];

  recordLimit: number = 0;
  filters: any = {};
  number: number = 0;
  paginationValues: Subject<any> = new Subject();
  page: Number = 0;
  loader: Boolean = true;
  adminId!: String
  constructor(private fb: FormBuilder, private adminAuthService: AdminAuthService, private teacherService: TeacherService) {
    this.teacherForm = this.fb.group({
      _id: [''],
      adminId: [''],
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')]],
      teacherUserId: ['', [Validators.required, Validators.pattern(/^\d{6}$/), Validators.pattern('^[0-9]+$')]],
      education: ['', [Validators.required, Validators.pattern('^[a-zA-Z.\\s]+$')]],
    })
  }

  ngOnInit(): void {
    let getAdmin = this.adminAuthService.getLoggedInAdminInfo();
    this.adminId = getAdmin?.id;
    let load: any = this.getTeacher({ page: 1 });
    if (load) {
      setTimeout(() => {
        this.loader = false;
      }, 1000);
    }
  }

  getTeacher($event: any) {
    this.page = $event.page;
    return new Promise((resolve, reject) => {
      let params: any = {
        filters: {},
        page: $event.page,
        limit: $event.limit ? $event.limit : this.recordLimit,
        adminId: this.adminId
      };
      this.recordLimit = params.limit;
      if (this.filters.searchText) {
        params["filters"]["searchText"] = this.filters.searchText.trim();
      }

      this.teacherService.teacherPaginationList(params).subscribe((res: any) => {
        if (res) {
          this.teacherInfo = res.teacherList;
          this.number = params.page;
          this.paginationValues.next({ type: 'page-init', page: params.page, totalTableRecords: res.countTeacher });
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
  }
  addTeacherModel() {
    this.showModal = true;
    this.deleteMode = false;
    this.teacherForm.reset();
  }
  updateTeacherModel(teacher: Teacher) {
    this.showModal = true;
    this.deleteMode = false;
    this.updateMode = true;
    this.teacherForm.patchValue(teacher);
  }
  deleteTeacherModel(id: String) {
    this.showModal = true;
    this.updateMode = false;
    this.deleteMode = true;
    this.deleteById = id;
  }

  successDone() {
    setTimeout(() => {
      this.closeModal();
      this.successMsg = '';
      this.getTeacher({ page: this.page });
    }, 1000)
  }
  teacherAddUpdate() {
    if (this.teacherForm.valid) {
      this.teacherForm.value.adminId = this.adminId;
      if (this.updateMode) {
        this.teacherService.updateTeacher(this.teacherForm.value).subscribe((res: any) => {
          if (res) {
            this.successDone();
            this.successMsg = res;
          }
        }, err => {
          this.errorCheck = true;
          this.errorMsg = err.error;
        })
      } else {
        this.teacherService.addTeacher(this.teacherForm.value).subscribe((res: any) => {
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

  changeStatus(id: any, statusValue: any) {
    if (id) {
      let params = {
        id: id,
        statusValue: statusValue,
      }
      this.teacherService.changeStatus(params).subscribe((res: any) => {
        if (res) {
          this.getTeacher({ page: this.page });
        }
      })
    }
  }

  teacherDelete(id: String) {
    this.teacherService.deleteTeacher(id).subscribe((res: any) => {
      if (res) {
        this.successDone();
        this.successMsg = res;
        this.deleteById = '';
      }
    })
  }
}
