import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Subject } from 'rxjs';
import { read, utils, writeFile } from 'xlsx';
import { ExamResultService } from 'src/app/services/exam-result.service';
import { MatRadioChange } from '@angular/material/radio';
import { ExamResultStructureService } from 'src/app/services/exam-result-structure.service';
import { TeacherAuthService } from 'src/app/services/auth/teacher-auth.service';
import { TeacherService } from 'src/app/services/teacher.service';

@Component({
  selector: 'app-teacher-result',
  templateUrl: './teacher-result.component.html',
  styleUrls: ['./teacher-result.component.css']
})
export class TeacherResultComponent implements OnInit {

  examResultForm: FormGroup;
  showModal: boolean = false;
  showBulkImportModal: boolean = false;
  updateMode: boolean = false;
  deleteMode: boolean = false;
  deleteById: String = '';
  successMsg: String = '';
  errorMsg: String = '';
  errorCheck: Boolean = false;
  allExamResults: any[] = [];
  examResultInfo: any[] = [];
  studentInfo: any;
  recordLimit: number = 10;
  filters: any = {};
  number: number = 0;
  paginationValues: Subject<any> = new Subject();
  page: Number = 0;
  cls: any;
  selectedValue: number = 0;
  classSubject: any[] = [];
  practicalSubjects: any[] = [];
  fileChoose: boolean = false;
  existRollnumber: number[] = [];
  bulkResult: any[] = [];
  selectedExam: any = '';
  stream: string = '';
  teacherInfo:any;
  createdBy:String = '';
  notApplicable: String = "stream";
  examType: any[] = ["quarterly", "half yearly", "final"];
  streamMainSubject: any[] = ['Mathematics(Science)', 'Biology(Science)', 'History(Arts)', 'Sociology(Arts)', 'Political Science(Arts)', 'Accountancy(Commerce)', 'Economics(Commerce)', 'Agriculture', 'Home Science'];
  loader:Boolean=true;

  constructor(private fb: FormBuilder, public activatedRoute: ActivatedRoute,private teacherAuthService:TeacherAuthService,private teacherService:TeacherService, private examResultService: ExamResultService, private examResultStructureService: ExamResultStructureService) {
    this.examResultForm = this.fb.group({
      rollNumber: ['', Validators.required],
      examType: [''],
      stream: [''],
      createdBy:[''],
      type: this.fb.group({
        theoryMarks: this.fb.array([]),
        practicalMarks: this.fb.array([]),
      }),
    });
  }


  ngOnInit(): void {
    this.cls = this.activatedRoute.snapshot.paramMap.get('id');
    this.teacherInfo = this.teacherAuthService.getLoggedInTeacherInfo();
    if(this.teacherInfo){
      this.getTeacherById(this.teacherInfo.id)
    }
    this.getStudentExamResultByClass(this.cls);
  }
  getTeacherById(id:string){
    this.teacherService.getTeacherById(id).subscribe((res:any)=> {
      if(res){
        this.createdBy = `${res.name} (${res.teacherUserId})`;
      }

    })
  }

  addExamResultModel() {
    this.showModal = true;
    this.deleteMode = false;
    this.updateMode = false;
    this.examResultForm.reset();

  }
  addBulkExamResultModel() {
    this.showBulkImportModal = true;
    this.errorCheck = false;
  }
  updateExamResultModel(examResult: any) {
    this.showModal = true;
    this.deleteMode = false;
    this.updateMode = true;
    this.examResultForm.patchValue(examResult);
  }
  deleteExamResultModel(id: String) {
    this.showModal = true;
    this.updateMode = false;
    this.deleteMode = true;
    this.deleteById = id;
  }

  falseFormValue() {
    const controlOne = <FormArray>this.examResultForm.get('type.theoryMarks');
    const controlTwo = <FormArray>this.examResultForm.get('type.practicalMarks');
    controlOne.clear();
    controlTwo.clear();
    this.examResultForm.reset();
  }
  falseAllValue() {
    this.falseFormValue();
    this.practicalSubjects = [];
    this.classSubject = [];
  }

  closeModal() {
    this.falseAllValue();
    this.updateMode = false;
    this.deleteMode = false;
    this.errorMsg = '';
    this.selectedExam = '';
    this.stream = '';
    this.examResultForm.reset();
    this.showModal = false;
    this.showBulkImportModal = false;
  }
  onChange(event: MatRadioChange) {
    this.selectedValue = event.value;
  }

  successDone() {
    setTimeout(() => {
      this.closeModal();
      this.successMsg = '';
      this.getStudentExamResultByClass(this.cls);
    }, 1000)
  }

  getStudentExamResultByClass(cls: any) {
    this.examResultService.getAllStudentExamResultByClass(cls).subscribe((res: any) => {
      if (res) {
        this.examResultInfo = res.examResultInfo;
        this.studentInfo = res.studentInfo;
        const studentInfoMap = new Map();
        this.studentInfo.forEach((item: any) => {
          studentInfoMap.set(item._id, item);
        });
        
        const combinedData = this.examResultInfo.reduce((result: any, examResult: any) => {
          const studentInfo = studentInfoMap.get(examResult.studentId);
        
          if (studentInfo) {
            result.push({
              studentId: examResult.studentId,
              class: examResult.class,
              examType: examResult.examType,
              stream: examResult.stream,
              createdBy:examResult.createdBy,
              status: examResult.status || "",
              name: studentInfo.name,
              rollNumber: studentInfo.rollNumber,
              admissionNo: studentInfo.admissionNo
            });
          }
        
          return result;
        }, []);
        if (combinedData) {
          this.allExamResults = combinedData;
          setTimeout(()=>{
            this.loader = false;
          },1000);
        }
      }
    })
  }


  selectExam(selectedExam: string) {
    if(this.classSubject || this.practicalSubjects){
      this.falseAllValue();
    }
    this.selectedExam = selectedExam;
    if (this.stream && selectedExam && this.cls) {
      let params = {
        cls: this.cls,
        stream: this.stream,
        examType: selectedExam,
      }
      this.getSingleClassResultStrucByStream(params);
    }
  }

  chooseStream(stream: any) {
    if(this.classSubject || this.practicalSubjects){
      this.falseAllValue();
    }
    this.stream = stream;
    if (stream && this.selectedExam && this.cls) {
      let params = {
        cls: this.cls,
        stream: stream,
        examType: this.selectedExam,
      }
      this.getSingleClassResultStrucByStream(params);
    }
  }

  getSingleClassResultStrucByStream(params: any) {
    this.examResultStructureService.getSingleClassResultStrucByStream(params).subscribe((res: any) => {
      if (res) {
        this.practicalSubjects = [];
        this.classSubject = [];
        if (res.theoryMaxMarks) {
          this.classSubject = res.theoryMaxMarks.map((item: any) => {
            const theorySubject = Object.keys(item)[0];
            return theorySubject;
          })
          if (this.classSubject) {
            this.patchTheory();
          }
        }

        if (res.practicalMaxMarks) {
          this.practicalSubjects = res.practicalMaxMarks.map((item: any) => {
            const practicalSubject = Object.keys(item)[0];
            return practicalSubject;
          })
          if (this.practicalSubjects) {
            this.patchPractical();
          }
        }
      }
    }, err => {
      this.falseAllValue();
    })
  }

  patchTheory() {
    const controlOne = <FormArray>this.examResultForm.get('type.theoryMarks');
    this.classSubject.forEach((x: any) => {
      controlOne.push(this.patchTheoryValues(x))
      this.examResultForm.reset();
    })
  }
  patchPractical() {
    const controlOne = <FormArray>this.examResultForm.get('type.practicalMarks');
    this.practicalSubjects.forEach((x: any) => {
      controlOne.push(this.patchPracticalValues(x))
      this.examResultForm.reset();
    })
  }
  patchTheoryValues(theoryMarks: any) {
    return this.fb.group({
      [theoryMarks]: [theoryMarks],
    })
  }

  patchPracticalValues(practicalMarks: any) {
    return this.fb.group({
      [practicalMarks]: [practicalMarks],
    })
  }

  examResultAddUpdate() {
    if (this.examResultForm.valid) {
      if (this.updateMode) {
        this.examResultService.updateExamResult(this.examResultForm.value).subscribe((res: any) => {
          if (res) {
            this.successDone();
            this.successMsg = res;
          }
        }, err => {
          this.errorCheck = true;
          this.errorMsg = err.error;
        })
      } else {
        if (this.practicalSubjects.length === 0) {
          delete this.examResultForm.value.type.practicalMarks;
        }
        this.examResultForm.value.examType = this.selectedExam;
        this.examResultForm.value.createdBy = this.createdBy;
        this.examResultForm.value.stream = this.stream;
        this.examResultForm.value.class = this.cls;
        this.examResultService.addExamResult(this.examResultForm.value).subscribe((res: any) => {
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

  examResultDelete(id: String) {
    this.examResultService.deleteExamResult(id).subscribe((res: any) => {
      if (res) {
        this.successDone();
        this.successMsg = res;
        this.deleteById = '';
      }
    })
  }


  handleImport($event: any) {
    this.fileChoose = true;
    const files = $event.target.files;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;

        if (sheets.length) {
          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
          this.bulkResult = rows;
        }
      }
      reader.readAsArrayBuffer(file);
    }

  }

  addBulkExamResult() {
    let resultData = {
      examType: this.selectedExam,
      stream: this.stream,
      bulkResult: this.bulkResult,
      createdBy:this.createdBy,
    }

    this.examResultService.addBulkExamResult(resultData).subscribe((res: any) => {
      if (res) {
        this.successDone();
        this.successMsg = res;
      }
    }, err => {
      this.errorCheck = true;
      this.errorMsg = err.error;
    })
  }

  handleExport() {
    let rollNumber = "rollNumber";
    const headings = [[
      rollNumber,
      'Class',
      'Hindi',
      'English',
      'Sanskrit',
      'Maths',
      'Science'
    ]];
    const wb = utils.book_new();
    const ws: any = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, headings);
    utils.sheet_add_json(ws, this.bulkResult, { origin: 'A2', skipHeader: true });
    utils.book_append_sheet(wb, ws, 'Report');
    writeFile(wb, 'Result.xlsx');
  }
}
