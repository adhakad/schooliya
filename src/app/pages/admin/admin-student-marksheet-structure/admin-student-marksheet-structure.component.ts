import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AdminAuthService } from 'src/app/services/auth/admin-auth.service';
import { ClassSubjectService } from 'src/app/services/class-subject.service';
import { ExamResultStructureService } from 'src/app/services/exam-result-structure.service';

@Component({
  selector: 'app-admin-student-marksheet-structure',
  templateUrl: './admin-student-marksheet-structure.component.html',
  styleUrls: ['./admin-student-marksheet-structure.component.css']
})
export class AdminStudentMarksheetStructureComponent implements OnInit {
  examResultForm: FormGroup;
  disabled = true;
  showModal: boolean = false;
  showExamResultStructureModal: boolean = false;
  updateMode: boolean = false;
  deleteMode: boolean = false;
  deleteById: String = '';
  successMsg: String = '';
  errorMsg: String = '';
  errorCheck: Boolean = false;
  cls: any;
  classSubject: any[] = [];
  examResultStr: any;
  examResultInfo: any;
  processedTheoryData: any[] = [];
  processedPracticalData: any[] = [];

  stream: string = '';
  notApplicable: String = "stream";

  streamMainSubject: any[] = ['Mathematics(Science)', 'Biology(Science)', 'History(Arts)', 'Sociology(Arts)', 'Political Science(Arts)', 'Accountancy(Commerce)', 'Economics(Commerce)', 'Agriculture', 'Home Science'];
  loader: Boolean = true;
  isChecked!: Boolean;
  adminId!: string;
  constructor(private fb: FormBuilder, public activatedRoute: ActivatedRoute, private adminAuthService: AdminAuthService, private classSubjectService: ClassSubjectService, private examResultStructureService: ExamResultStructureService) {
    this.examResultForm = this.fb.group({
      adminId: [''],
      class: [''],
      stream: [''],
      templateName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    let getAdmin = this.adminAuthService.getLoggedInAdminInfo();
    this.adminId = getAdmin?.id;
    this.cls = this.activatedRoute.snapshot.paramMap.get('id');
    this.getExamResultStructureByClass(this.cls);
  }

  processData(examResult: any) {
    for (let i = 0; i < examResult.theoryMaxMarks.length; i++) {
      const subject = Object.keys(examResult.theoryMaxMarks[i])[0];
      const theoryMaxMarks = Object.values(examResult.theoryMaxMarks[i])[0];
      const theoryPassMarks = Object.values(examResult.theoryPassMarks[i])[0];
      this.processedTheoryData.push({
        subject,
        theoryMaxMarks,
        theoryPassMarks,
      });
    }
    for (let i = 0; i < examResult.practicalMaxMarks.length; i++) {
      const subject = Object.keys(examResult.practicalMaxMarks[i])[0];
      const practicalMaxMarks = Object.values(examResult.practicalMaxMarks[i])[0];
      const practicalPassMarks = Object.values(examResult.practicalPassMarks[i])[0];
      this.processedPracticalData.push({
        subject,
        practicalMaxMarks,
        practicalPassMarks,
      });
    }

  }

  addExamResultModel() {
    this.showModal = true;
    this.examResultForm.reset();
  }
  openExamResultStructureModal(examResult: any) {
    this.showExamResultStructureModal = true;
    this.examResultInfo = examResult;
    this.processData(examResult);
  }
  deleteResultStructureModel(id: String) {
    this.showModal = true;
    this.deleteMode = true;
    this.deleteById = id;
  }

  falseFormValue() {
    this.examResultForm.reset();
  }
  falseAllValue() {
    this.falseFormValue();
    this.stream = '';
    this.classSubject = [];
  }
  closeModal() {
    this.falseAllValue();
    this.showModal = false;
    this.errorMsg = '';
    this.deleteMode = false;
    this.deleteById = '';
    this.successMsg = '';
    this.showExamResultStructureModal = false;
    this.examResultInfo;
    this.processedTheoryData = [];
    this.processedPracticalData = [];
    this.examResultForm.reset();
  }
  successDone() {
    setTimeout(() => {
      this.closeModal();
      this.successMsg = '';
      this.getExamResultStructureByClass(this.cls)
    }, 1000)
  }
  getExamResultStructureByClass(cls: any) {
    let params = {
      class: cls,
      adminId: this.adminId,
    }
    this.examResultStructureService.examResultStructureByClass(params).subscribe((res: any) => {
      if (res) {
        this.examResultStr = res;
        setTimeout(() => {
          this.loader = false;
        }, 1000);
      }
    })
  }

  chooseStream(stream: any) {
    this.falseFormValue();
    if (stream) {
      this.stream = stream;
      let params = {
        cls: this.cls,
        stream: stream,
        adminId: this.adminId,

      }
      this.getSingleClassSubjectByStream(params)
    }
  }

  getSingleClassSubjectByStream(params: any) {
    this.classSubjectService.getSingleClassSubjectByStream(params).subscribe((res: any) => {
      if (res) {
        this.classSubject = res.subject;
      }
    })
  }

  examResultAddUpdate() {
    this.examResultForm.value.adminId = this.adminId;
    this.examResultForm.value.class = this.cls;
    this.examResultForm.value.stream = this.stream;
    this.examResultStructureService.addExamResultStructure(this.examResultForm.value).subscribe((res: any) => {
      if (res) {
        this.successDone();
        this.successMsg = res;
      }
    }, err => {
      this.errorCheck = true;
      this.errorMsg = err.error;
    })


  }

  onToggleChange(id: any, resultPublishStatus: any) {
    let params = {
      id: id,
      resultPublishStatus: resultPublishStatus
    }
    this.examResultStructureService.changeResultPublishStatus(params)
      .subscribe(
        (response: any) => {
        },
        error => {
          this.getExamResultStructureByClass(this.cls);
        }
      );
  }

  resultStructureDelete(id: String) {
    this.examResultStructureService.deleteResultStructure(id).subscribe((res: any) => {
      if (res) {
        this.successDone();
        this.successMsg = res;
        this.deleteById = '';
      }
    })
  }

}

