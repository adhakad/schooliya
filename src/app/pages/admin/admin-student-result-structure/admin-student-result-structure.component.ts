import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AdminAuthService } from 'src/app/services/auth/admin-auth.service';
import { ClassSubjectService } from 'src/app/services/class-subject.service';
import { ExamResultStructureService } from 'src/app/services/exam-result-structure.service';


@Component({
  selector: 'app-admin-student-result-structure',
  templateUrl: './admin-student-result-structure.component.html',
  styleUrls: ['./admin-student-result-structure.component.css']
})
export class AdminStudentResultStructureComponent implements OnInit {
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
  marksTypeMode: boolean = false;
  marksMode: boolean = false;
  theoryMarks: boolean = false;
  practicalMarks: boolean = false;

  periodicTestMarks: boolean = false;
  noteBookMarks: boolean = false;
  subjectEnrichmentMarks: boolean = false;
  gradeRange: boolean = true;
  
  stream: string = '';
  notApplicable: String = "stream";


  periodicTestMaxMarks: any=[];
  // periodicTestPassMarks: any =[];
  noteBookMaxMarks: any= [];
  // noteBookPassMarks: any =[];
  subjectEnrichmentMaxMarks: any =[];
  // subjectEnrichmentPassMarks: any=[];



  gradeMinMarks: any = [{ "A+": 91 }, { "A": 81 }, { "B+": 71 }, { "B": 61 }, { "C+": 51 }, { "C": 41 }, { "D": 33 }, { "F": 0 }];
  gradeMaxMarks: any = [{ "A+": 100 }, { "A": 90 }, { "B+": 80 }, { "B": 70 }, { "C+": 60 }, { "C": 50 }, { "D": 40 }, { "F": 32 }];
  examType: any[] = ["quarterly", "half yearly", "final"];
  streamMainSubject: any[] = ['Mathematics(Science)', 'Biology(Science)', 'History(Arts)', 'Sociology(Arts)', 'Political Science(Arts)', 'Accountancy(Commerce)', 'Economics(Commerce)', 'Agriculture', 'Home Science'];
  loader: Boolean = true;
  isChecked!: Boolean;
  adminId!:string;
  constructor(private fb: FormBuilder, public activatedRoute: ActivatedRoute,private adminAuthService: AdminAuthService, private classSubjectService: ClassSubjectService, private examResultStructureService: ExamResultStructureService) {
    this.examResultForm = this.fb.group({
      adminId:[''],
      class: [''],
      examType: ['', Validators.required],
      stream: [''],
      type: this.fb.group({
        theoryMaxMarks: this.fb.array([], [Validators.required]),
        theoryPassMarks: this.fb.array([], [Validators.required]),
        practicalMaxMarks: this.fb.array([]),
        practicalPassMarks: this.fb.array([]),
        periodicTestMaxMarks: [''],
        // periodicTestPassMarks: [''],
        noteBookMaxMarks: [''],
        // noteBookPassMarks: [''],
        subjectEnrichmentMaxMarks: [''],
        // subjectEnrichmentPassMarks: [''],
        gradeMinMarks: [''],
        gradeMaxMarks: ['']
      }),
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
    this.marksTypeMode = true;
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
    const controlOne = <FormArray>this.examResultForm.get('type.theoryMaxMarks');
    const controlTwo = <FormArray>this.examResultForm.get('type.theoryPassMarks');
    const controlThree = <FormArray>this.examResultForm.get('type.practicalMaxMarks');
    const controlFour = <FormArray>this.examResultForm.get('type.practicalPassMarks');
    controlOne.clear();
    controlTwo.clear();
    controlThree.clear();
    controlFour.clear();
    this.examResultForm.reset();
  }
  falseAllValue() {
    this.falseFormValue();
    this.marksTypeMode = false;
    this.marksMode = false;
    this.practicalMarks = false;
    this.theoryMarks = false;
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
      class:cls,
      adminId:this.adminId,
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
      this.theoryMarks = true;
      let params = {
        cls: this.cls,
        stream: stream,
        adminId:this.adminId,

      }
      if (this.theoryMarks) {
        this.getSingleClassSubjectByStream(params)
      }
    }
  }

  getSingleClassSubjectByStream(params: any) {
    this.classSubjectService.getSingleClassSubjectByStream(params).subscribe((res: any) => {
      if (res) {
        this.classSubject = res.subject;
        if (this.classSubject) {
          if (this.theoryMarks) {
            this.patchTheoryMarks();
          }
          if (this.practicalMarks) {
            this.patchPracticalMarks();
          }
        }
      }
      if (!res) {
        this.classSubject = [];
        this.theoryMarks = false;
      }
    })
  }

  practical(practicalMarks: boolean) {
    if (practicalMarks === false) {
      this.practicalMarks = true;
    }
    if (practicalMarks === true) {
      this.practicalMarks = false;
    }
  }
  periodicTest(periodicTestMarks: boolean) {
    if (periodicTestMarks === false) {
      this.periodicTestMarks = true;
      this.periodicTestMaxMarks = this.classSubject.map((x: any) => {
        return { [x.subject]: 10 };
      });
    }
    if (periodicTestMarks === true) {
      this.periodicTestMarks = false;
    }
  }
  noteBook(noteBookMarks: boolean) {
    if (noteBookMarks === false) {
      this.noteBookMarks = true;
      this.noteBookMaxMarks = this.classSubject.map((x: any) => {
        return { [x.subject]: 5 };
      });
    }
    if (noteBookMarks === true) {
      this.noteBookMarks = false;
    }
  }
  subjectEnrichment(subjectEnrichmentMarks: boolean) {
    if (subjectEnrichmentMarks === false) {
      this.subjectEnrichmentMarks = true;
      this.subjectEnrichmentMaxMarks = this.classSubject.map((x: any) => {
        return { [x.subject]: 5 };
      });
    }
    if (subjectEnrichmentMarks === true) {
      this.subjectEnrichmentMarks = false;
    }
  }



  selectExamResultStructure() {
    this.marksTypeMode = false;
    this.marksMode = true;
  }



  patchTheoryMarks() {
    const controlOne = <FormArray>this.examResultForm.get('type.theoryMaxMarks');
    this.classSubject.forEach((x: any) => {
      controlOne.push(this.patchTheoryMaxMarks(x.subject))
      this.examResultForm.reset();
    })

    const controlTwo = <FormArray>this.examResultForm.get('type.theoryPassMarks');
    this.classSubject.forEach((x: any) => {
      controlTwo.push(this.patchTheoryPassMarks(x.subject))
      this.examResultForm.reset();
    })
  }

  patchPracticalMarks() {
    const controlThree = <FormArray>this.examResultForm.get('type.practicalMaxMarks');
    this.classSubject.forEach((x: any) => {
      controlThree.push(this.patchPracticalMaxMarks(x.subject))
      this.examResultForm.reset();
    })
    const controlFour = <FormArray>this.examResultForm.get('type.practicalPassMarks');
    this.classSubject.forEach((x: any) => {
      controlFour.push(this.patchPracticalPassMarks(x.subject))
      this.examResultForm.reset();
    })
  }




  patchTheoryMaxMarks(theoryMaxMarks: any) {
    return this.fb.group({
      [theoryMaxMarks]: [theoryMaxMarks],
    })
  }
  patchTheoryPassMarks(theoryPassMarks: any) {
    return this.fb.group({
      [theoryPassMarks]: [theoryPassMarks],
    })
  }

  patchPracticalMaxMarks(practicalMaxMarks: any) {
    return this.fb.group({
      [practicalMaxMarks]: [practicalMaxMarks],
    })
  }
  patchPracticalPassMarks(practicalPassMarks: any) {
    return this.fb.group({
      [practicalPassMarks]: [practicalPassMarks],
    })
  }

  examResultAddUpdate() { 
    this.examResultForm.value.adminId = this.adminId;
    this.examResultForm.value.class = this.cls;
    this.examResultForm.value.stream = this.stream;
    if (this.gradeRange) {
      this.examResultForm.value.type.gradeMinMarks = this.gradeMinMarks;
      this.examResultForm.value.type.gradeMaxMarks = this.gradeMaxMarks;
    }
    if (this.periodicTestMarks) {
      this.examResultForm.value.type.periodicTestMaxMarks = this.periodicTestMaxMarks;
    }
    if (this.noteBookMarks) {
      this.examResultForm.value.type.noteBookMaxMarks = this.noteBookMaxMarks;
    }
    if (this.subjectEnrichmentMarks) {
      this.examResultForm.value.type.subjectEnrichmentMaxMarks = this.subjectEnrichmentMaxMarks;
    }

    if (this.practicalMarks) {
      let practicalMaxMarksObj = this.examResultForm.value.type.practicalMaxMarks;
      let practicalPassMarksObj = this.examResultForm.value.type.practicalPassMarks;
      this.examResultForm.value.type.practicalMaxMarks = practicalMaxMarksObj.filter((subject: any) => {
        const value = Object.values(subject)[0];
        return value !== null && value !== undefined;
      });
      this.examResultForm.value.type.practicalPassMarks = practicalPassMarksObj.filter((subject: any) => {
        const value = Object.values(subject)[0];
        return value !== null && value !== undefined;
      });
      let containsPracticalMaxMarksNull = practicalMaxMarksObj.some((item: any) => Object.values(item).includes(null));
      let containsPracticalPassMarksNull = practicalPassMarksObj.some((item: any) => Object.values(item).includes(null));
    }
    if (!this.practicalMarks) {
      delete this.examResultForm.value.type.practicalMaxMarks;
      delete this.examResultForm.value.type.practicalPassMarks;
    }

    let theoryMaxMarksObj = this.examResultForm.value.type.theoryMaxMarks;
    let theoryPassMarksObj = this.examResultForm.value.type.theoryPassMarks;
    let containsTheoryMaxMarksNull = theoryMaxMarksObj.some((item: any) => Object.values(item).includes(null));
    let containsTheoryPassMarksNull = theoryPassMarksObj.some((item: any) => Object.values(item).includes(null));
    if (containsTheoryMaxMarksNull || containsTheoryPassMarksNull) {
      this.errorCheck = true;
      this.errorMsg = 'Please fill all fields';
    }
    if (!containsTheoryMaxMarksNull && !containsTheoryPassMarksNull) {

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










// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
// import { AdminAuthService } from 'src/app/services/auth/admin-auth.service';
// import { ClassSubjectService } from 'src/app/services/class-subject.service';
// import { ExamResultStructureService } from 'src/app/services/exam-result-structure.service';


// @Component({
//   selector: 'app-admin-student-result-structure',
//   templateUrl: './admin-student-result-structure.component.html',
//   styleUrls: ['./admin-student-result-structure.component.css']
// })
// export class AdminStudentResultStructureComponent implements OnInit {
//   examResultForm: FormGroup;
//   disabled = true;
//   showModal: boolean = false;
//   showExamResultStructureModal: boolean = false;
//   updateMode: boolean = false;
//   deleteMode: boolean = false;
//   deleteById: String = '';
//   successMsg: String = '';
//   errorMsg: String = '';
//   errorCheck: Boolean = false;
//   cls: any;
//   classSubject: any[] = [];
//   examResultStr: any;
//   examResultInfo: any;
//   processedTheoryData: any[] = [];
//   processedPracticalData: any[] = [];
//   marksTypeMode: boolean = false;
//   marksMode: boolean = false;
//   theoryMarks: boolean = false;
//   practicalMarks: boolean = false;
//   gradeRange: boolean = true;
//   stream: string = '';
//   notApplicable: String = "stream";
//   gradeMinMarks: any = [{ "A+": 91 }, { "A": 81 }, { "B+": 71 }, { "B": 61 }, { "C+": 51 }, { "C": 41 }, { "D": 33 }, { "F": 0 }];
//   gradeMaxMarks: any = [{ "A+": 100 }, { "A": 90 }, { "B+": 80 }, { "B": 70 }, { "C+": 60 }, { "C": 50 }, { "D": 40 }, { "F": 32 }];
//   examType: any[] = ["quarterly", "half yearly", "final"];
//   streamMainSubject: any[] = ['Mathematics(Science)', 'Biology(Science)', 'History(Arts)', 'Sociology(Arts)', 'Political Science(Arts)', 'Accountancy(Commerce)', 'Economics(Commerce)', 'Agriculture', 'Home Science'];
//   loader: Boolean = true;
//   isChecked!: Boolean;
//   adminId!:string;
//   constructor(private fb: FormBuilder, public activatedRoute: ActivatedRoute,private adminAuthService: AdminAuthService, private classSubjectService: ClassSubjectService, private examResultStructureService: ExamResultStructureService) {
//     this.examResultForm = this.fb.group({
//       adminId:[''],
//       class: [''],
//       examType: ['', Validators.required],
//       stream: [''],
//       type: this.fb.group({
//         theoryMaxMarks: this.fb.array([], [Validators.required]),
//         theoryPassMarks: this.fb.array([], [Validators.required]),
//         practicalMaxMarks: this.fb.array([]),
//         practicalPassMarks: this.fb.array([]),
//         gradeMinMarks: [''],
//         gradeMaxMarks: ['']
//       }),
//     });
//   }

//   ngOnInit(): void {
//     let getAdmin = this.adminAuthService.getLoggedInAdminInfo();
//     this.adminId = getAdmin?.id;
//     this.cls = this.activatedRoute.snapshot.paramMap.get('id');
//     this.getExamResultStructureByClass(this.cls);
//   }

//   processData(examResult: any) {
//     for (let i = 0; i < examResult.theoryMaxMarks.length; i++) {
//       const subject = Object.keys(examResult.theoryMaxMarks[i])[0];
//       const theoryMaxMarks = Object.values(examResult.theoryMaxMarks[i])[0];
//       const theoryPassMarks = Object.values(examResult.theoryPassMarks[i])[0];
//       this.processedTheoryData.push({
//         subject,
//         theoryMaxMarks,
//         theoryPassMarks,
//       });
//     }
//     for (let i = 0; i < examResult.practicalMaxMarks.length; i++) {
//       const subject = Object.keys(examResult.practicalMaxMarks[i])[0];
//       const practicalMaxMarks = Object.values(examResult.practicalMaxMarks[i])[0];
//       const practicalPassMarks = Object.values(examResult.practicalPassMarks[i])[0];
//       this.processedPracticalData.push({
//         subject,
//         practicalMaxMarks,
//         practicalPassMarks,
//       });
//     }
    
//   }

//   addExamResultModel() {
//     this.showModal = true;
//     this.marksTypeMode = true;
//     this.examResultForm.reset();
//   }
//   openExamResultStructureModal(examResult: any) {
//     this.showExamResultStructureModal = true;
//     this.examResultInfo = examResult;
//     this.processData(examResult);
//   }
//   deleteResultStructureModel(id: String) {
//     this.showModal = true;
//     this.deleteMode = true;
//     this.deleteById = id;
//   }

//   falseFormValue() {
//     const controlOne = <FormArray>this.examResultForm.get('type.theoryMaxMarks');
//     const controlTwo = <FormArray>this.examResultForm.get('type.theoryPassMarks');
//     const controlThree = <FormArray>this.examResultForm.get('type.practicalMaxMarks');
//     const controlFour = <FormArray>this.examResultForm.get('type.practicalPassMarks');
//     controlOne.clear();
//     controlTwo.clear();
//     controlThree.clear();
//     controlFour.clear();
//     this.examResultForm.reset();
//   }
//   falseAllValue() {
//     this.falseFormValue();
//     this.marksTypeMode = false;
//     this.marksMode = false;
//     this.practicalMarks = false;
//     this.theoryMarks = false;
//     this.stream = '';
//     this.classSubject = [];
//   }
//   closeModal() {
//     this.falseAllValue();
//     this.showModal = false;
//     this.errorMsg = '';
//     this.deleteMode = false;
//     this.deleteById = '';
//     this.successMsg = '';
//     this.showExamResultStructureModal = false;
//     this.examResultInfo;
//     this.processedTheoryData = [];
//     this.processedPracticalData = [];
//     this.examResultForm.reset();
//   }
//   successDone() {
//     setTimeout(() => {
//       this.closeModal();
//       this.successMsg = '';
//       this.getExamResultStructureByClass(this.cls)
//     }, 1000)
//   }
//   getExamResultStructureByClass(cls: any) {
//     let params = {
//       class:cls,
//       adminId:this.adminId,
//     }
//     this.examResultStructureService.examResultStructureByClass(params).subscribe((res: any) => {
//       if (res) {
//         this.examResultStr = res;
//         setTimeout(() => {
//           this.loader = false;
//         }, 1000);
//       }
//     })
//   }

//   chooseStream(stream: any) {
//     this.falseFormValue();
//     if (stream) {
//       this.stream = stream;
//       this.theoryMarks = true;
//       let params = {
//         cls: this.cls,
//         stream: stream,
//         adminId:this.adminId,

//       }
//       if (this.theoryMarks) {
//         this.getSingleClassSubjectByStream(params)
//       }
//     }
//   }

//   getSingleClassSubjectByStream(params: any) {
//     this.classSubjectService.getSingleClassSubjectByStream(params).subscribe((res: any) => {
//       if (res) {
//         this.classSubject = res.subject;
//         if (this.classSubject) {
//           if (this.theoryMarks) {
//             this.patchTheoryMarks();
//           }
//           if (this.practicalMarks) {
//             this.patchPracticalMarks();
//           }
//         }
//       }
//       if (!res) {
//         this.classSubject = [];
//         this.theoryMarks = false;
//       }
//     })
//   }

//   practical(practicalMarks: boolean) {
//     if (practicalMarks === false) {
//       this.practicalMarks = true;
//     }
//     if (practicalMarks === true) {
//       this.practicalMarks = false;
//     }
//   }

//   selectExamResultStructure() {
//     this.marksTypeMode = false;
//     this.marksMode = true;
//   }



//   patchTheoryMarks() {
//     const controlOne = <FormArray>this.examResultForm.get('type.theoryMaxMarks');
//     this.classSubject.forEach((x: any) => {
//       controlOne.push(this.patchTheoryMaxMarks(x.subject))
//       this.examResultForm.reset();
//     })

//     const controlTwo = <FormArray>this.examResultForm.get('type.theoryPassMarks');
//     this.classSubject.forEach((x: any) => {
//       controlTwo.push(this.patchTheoryPassMarks(x.subject))
//       this.examResultForm.reset();
//     })
//   }

//   patchPracticalMarks() {
//     const controlThree = <FormArray>this.examResultForm.get('type.practicalMaxMarks');
//     this.classSubject.forEach((x: any) => {
//       controlThree.push(this.patchPracticalMaxMarks(x.subject))
//       this.examResultForm.reset();
//     })
//     const controlFour = <FormArray>this.examResultForm.get('type.practicalPassMarks');
//     this.classSubject.forEach((x: any) => {
//       controlFour.push(this.patchPracticalPassMarks(x.subject))
//       this.examResultForm.reset();
//     })
//   }




//   patchTheoryMaxMarks(theoryMaxMarks: any) {
//     return this.fb.group({
//       [theoryMaxMarks]: [theoryMaxMarks],
//     })
//   }
//   patchTheoryPassMarks(theoryPassMarks: any) {
//     return this.fb.group({
//       [theoryPassMarks]: [theoryPassMarks],
//     })
//   }

//   patchPracticalMaxMarks(practicalMaxMarks: any) {
//     return this.fb.group({
//       [practicalMaxMarks]: [practicalMaxMarks],
//     })
//   }
//   patchPracticalPassMarks(practicalPassMarks: any) {
//     return this.fb.group({
//       [practicalPassMarks]: [practicalPassMarks],
//     })
//   }

//   examResultAddUpdate() { 
//     this.examResultForm.value.adminId = this.adminId;
//     this.examResultForm.value.class = this.cls;
//     this.examResultForm.value.stream = this.stream;
//     if (this.gradeRange) {
//       this.examResultForm.value.type.gradeMinMarks = this.gradeMinMarks;
//       this.examResultForm.value.type.gradeMaxMarks = this.gradeMaxMarks;
//     }
//     if (this.practicalMarks) {
//       let practicalMaxMarksObj = this.examResultForm.value.type.practicalMaxMarks;
//       let practicalPassMarksObj = this.examResultForm.value.type.practicalPassMarks;
//       this.examResultForm.value.type.practicalMaxMarks = practicalMaxMarksObj.filter((subject: any) => {
//         const value = Object.values(subject)[0];
//         return value !== null && value !== undefined;
//       });
//       this.examResultForm.value.type.practicalPassMarks = practicalPassMarksObj.filter((subject: any) => {
//         const value = Object.values(subject)[0];
//         return value !== null && value !== undefined;
//       });
//       let containsPracticalMaxMarksNull = practicalMaxMarksObj.some((item: any) => Object.values(item).includes(null));
//       let containsPracticalPassMarksNull = practicalPassMarksObj.some((item: any) => Object.values(item).includes(null));
//     }
//     if (!this.practicalMarks) {
//       delete this.examResultForm.value.type.practicalMaxMarks;
//       delete this.examResultForm.value.type.practicalPassMarks;
//     }

//     let theoryMaxMarksObj = this.examResultForm.value.type.theoryMaxMarks;
//     let theoryPassMarksObj = this.examResultForm.value.type.theoryPassMarks;
//     let containsTheoryMaxMarksNull = theoryMaxMarksObj.some((item: any) => Object.values(item).includes(null));
//     let containsTheoryPassMarksNull = theoryPassMarksObj.some((item: any) => Object.values(item).includes(null));
//     if (containsTheoryMaxMarksNull || containsTheoryPassMarksNull) {
//       this.errorCheck = true;
//       this.errorMsg = 'Please fill all fields';
//     }
//     if (!containsTheoryMaxMarksNull && !containsTheoryPassMarksNull) {

//       this.examResultStructureService.addExamResultStructure(this.examResultForm.value).subscribe((res: any) => {
//         if (res) {
//           this.successDone();
//           this.successMsg = res;
//         }
//       }, err => {
//         this.errorCheck = true;
//         this.errorMsg = err.error;
//       })
//     }

//   }

//   onToggleChange(id: any, resultPublishStatus: any) {
//     let params = {
//       id: id,
//       resultPublishStatus: resultPublishStatus
//     }
//     this.examResultStructureService.changeResultPublishStatus(params)
//       .subscribe(
//         (response: any) => {
//         },
//         error => {
//           this.getExamResultStructureByClass(this.cls);
//         }
//       );
//   }

//   resultStructureDelete(id: String) {
//     this.examResultStructureService.deleteResultStructure(id).subscribe((res: any) => {
//       if (res) {
//         this.successDone();
//         this.successMsg = res;
//         this.deleteById = '';
//       }
//     })
//   }

// }
