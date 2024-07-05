import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Subject } from 'rxjs';
import { read, utils, writeFile } from 'xlsx';
import { ExamResultService } from 'src/app/services/exam-result.service';
import { MatRadioChange } from '@angular/material/radio';
import { PrintPdfService } from 'src/app/services/print-pdf/print-pdf.service';
import { AdminAuthService } from 'src/app/services/auth/admin-auth.service';
import { ExamResultStructureService } from 'src/app/services/exam-result-structure.service';
import { SchoolService } from 'src/app/services/school.service';

@Component({
  selector: 'app-admin-student-result',
  templateUrl: './admin-student-result.component.html',
  styleUrls: ['./admin-student-result.component.css']
})
export class AdminStudentResultComponent implements OnInit {

  examResultForm: FormGroup;
  showModal: boolean = false;

  showBulkResultPrintModal: boolean = false;
  showBulkImportModal: boolean = false;
  updateMode: boolean = false;
  deleteMode: boolean = false;
  deleteById: String = '';
  successMsg: String = '';
  errorMsg: String = '';
  errorCheck: Boolean = false;
  schoolInfo: any;
  marksheetTemplateStructureInfo: any;
  resultStructureInfo: any;
  allExamResults: any[] = [];
  examResultInfo: any[] = [];
  mappedResults: any[] = [];
  studentInfo: any;
  recordLimit: number = 10;
  filters: any = {};
  number: number = 0;
  paginationValues: Subject<any> = new Subject();
  page: Number = 0;
  cls: any;
  selectedValue: number = 0;
  theorySubjects: any[] = [];
  practicalSubjects: any[] = [];
  periodicTestSubjects: any[] = [];
  noteBookSubjects: any[] = [];
  subjectEnrichmentSubjects: any[] = [];
  coScholastic: any[] = [];
  discipline: any[] = [];

  fileChoose: boolean = false;
  existRollnumber: number[] = [];
  bulkResult: any[] = [];
  selectedExam: any = '';
  stream: string = '';
  notApplicable: String = "stream";
  examType: any[] = [];
  streamMainSubject: any[] = ['Mathematics(Science)', 'Biology(Science)', 'History(Arts)', 'Sociology(Arts)', 'Political Science(Arts)', 'Accountancy(Commerce)', 'Economics(Commerce)', 'Agriculture', 'Home Science'];
  loader: Boolean = true;
  adminId!: string;
  constructor(private fb: FormBuilder, public activatedRoute: ActivatedRoute, private adminAuthService: AdminAuthService, private schoolService: SchoolService, private printPdfService: PrintPdfService, private examResultService: ExamResultService, private examResultStructureService: ExamResultStructureService) {
    this.examResultForm = this.fb.group({
      adminId: [''],
      rollNumber: ['324567300', Validators.required],
      examType: [''],
      stream: [''],
      createdBy: [''],
      resultDetail: [''],
      type: this.fb.group({
        theoryMarks: this.fb.array([]),
        practicalMarks: this.fb.array([]),
        periodicTestMarks: this.fb.array([]),
        noteBookMarks: this.fb.array([]),
        subjectEnrichmentMarks: this.fb.array([]),
        coScholastic: this.fb.array([]),
        discipline: this.fb.array([]),
      }),
    });
  }


  ngOnInit(): void {
    let getAdmin = this.adminAuthService.getLoggedInAdminInfo();
    this.adminId = getAdmin?.id;
    this.cls = this.activatedRoute.snapshot.paramMap.get('id');
    this.getStudentExamResultByClass(this.cls);
    this.getSchool();
  }

  // onChange(event: MatRadioChange) {
  //   this.selectedValue = event.value;
  // }
  getSchool() {
    this.schoolService.getSchool(this.adminId).subscribe((res: any) => {
      if (res) {
        this.schoolInfo = res;
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
    const controlThree = <FormArray>this.examResultForm.get('type.periodicTestMarks');
    const controlFour = <FormArray>this.examResultForm.get('type.noteBookMarks');
    const controlFive = <FormArray>this.examResultForm.get('type.subjectEnrichmentMarks');
    const controlSix = <FormArray>this.examResultForm.get('type.coScholastic');
    const controlSeven = <FormArray>this.examResultForm.get('type.discipline');
    controlOne.clear();
    controlTwo.clear();
    controlThree.clear();
    controlFour.clear();
    controlFive.clear();
    controlSix.clear();
    controlSeven.clear();
    this.examResultForm.reset();
  }
  falseAllValue() {
    this.falseFormValue();
    this.practicalSubjects = [];
    this.periodicTestSubjects = [];
    this.noteBookSubjects = [];
    this.subjectEnrichmentSubjects = [];
    this.theorySubjects = [];
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
    this.showBulkResultPrintModal = false;
    this.showBulkImportModal = false;
  }

  successDone() {
    setTimeout(() => {
      this.closeModal();
      this.successMsg = '';
      this.getStudentExamResultByClass(this.cls);
    }, 1000)
  }

  bulkPrint() {
    this.showBulkResultPrintModal = true;
  }

  getStudentExamResultByClass(cls: any) {
    let params = {
      class: cls,
      adminId: this.adminId,
    }
    this.examResultService.getAllStudentExamResultByClass(params).subscribe((res: any) => {
      if (res) {
        this.examResultInfo = res.examResultInfo;
        this.studentInfo = res.studentInfo;
        let isDate = res.isDate;
        let marksheetTemplateStructure = res.marksheetTemplateStructure;
        const gradeMinMarks = marksheetTemplateStructure.examStructure.term1.gradeMinMarks.map((grade: any) => Object.values(grade)[0]);
        const gradeMaxMarks = marksheetTemplateStructure.examStructure.term1.gradeMaxMarks.map((grade: any) => Object.values(grade)[0]);

        const overallMarksAndGrades = this.getAverageGrade(res.examResultInfo[0].resultDetail.term1.marks, res.examResultInfo[0].resultDetail.term2.marks, marksheetTemplateStructure.examStructure.term1.gradeMinMarks, marksheetTemplateStructure.examStructure.term1.gradeMaxMarks);
        console.log(overallMarksAndGrades)
        const mapExamResultsToStudents = (examResults: any, studentInfo: any) => {
          const studentInfoMap = studentInfo.reduce((acc: any, student: any) => {
            acc[student._id] = student;
            return acc;
          }, {});

          return examResults.map((result: any) => {
            const student = studentInfoMap[result.studentId];
            result.resultDetail.overallMarksAndGrades = overallMarksAndGrades;
            return {
              session: student.session,
              adminId: result.adminId,
              studentId: result.studentId,
              class: result.class,
              stream: result.stream,
              dob: student.dob,
              marksheetTemplateStructure: marksheetTemplateStructure,
              gradeMinMarks,
              gradeMaxMarks,
              resultDetail: result.resultDetail,
              status: result.status || "",
              name: student.name,
              fatherName: student.fatherName,
              motherName: student.motherName,
              rollNumber: student.rollNumber,
              admissionNo: student.admissionNo,
              isDate: isDate,
            };
          });
        };

        this.mappedResults = mapExamResultsToStudents(this.examResultInfo, this.studentInfo);
        console.log(this.mappedResults)
      }
    })
    setTimeout(() => {
      this.loader = false;
    }, 1000);
  }
  private getGrade(averageMarks: any, gradeMinMarks: any, gradeMaxMarks: any) {
    for (let i = 0; i < gradeMinMarks.length; i++) {
      const grade = Object.keys(gradeMinMarks[i])[0];
      const minMarks = gradeMinMarks[i][grade];
      const maxMarks = gradeMaxMarks[i][grade];

      if (averageMarks >= minMarks && averageMarks <= maxMarks) {
        return grade;
      }
    }
    return "Unknown"; // Default value if no grade matches
  }
  private getAverageGrade(term1: any, term2: any, gradeMinMarks: any, gradeMaxMarks: any) {
    const subjects: any = {};
    term1.forEach((mark: any) => {
      subjects[mark.subject] = [mark.totalMarks];
    });
    term2.forEach((mark: any) => {
      if (subjects[mark.subject]) {
        subjects[mark.subject].push(mark.totalMarks);
      } else {
        subjects[mark.subject] = [mark.totalMarks];
      }
    });
    const averageGrades = Object.keys(subjects).map((subject: any) => {
      const totalMarks = subjects[subject].reduce((acc: any, val: any) => acc + val, 0);
      const averageMarks = totalMarks / subjects[subject].length;
      const grade = this.getGrade(averageMarks, gradeMinMarks, gradeMaxMarks);
      return {
        subject,
        averageMarks,
        grade
      };
    });
    return averageGrades;
  }


  printStudentData() {
    const printContent = this.getPrintOneAdmitCardContent();
    this.printPdfService.printContent(printContent);
    this.closeModal();
  }



  private getPrintOneAdmitCardContent(): string {
    let schoolName = this.schoolInfo.schoolName;
    let city = this.schoolInfo.city;
    let printHtml = '<html>';
    printHtml += '<head>';
    printHtml += '<style>';
    printHtml += 'body {width: 100%; height: 100%; margin: 0; padding: 0; }';
    printHtml += 'div {margin: 0; padding: 0;}';
    printHtml += '.custom-container {font-family: Arial, sans-serif;overflow: auto; width: 100%; height: 100%; box-sizing: border-box;}';
    printHtml += '.table-container {width: 100%;height: 100%; background-color: #fff;border: 2px solid #9e9e9e; box-sizing: border-box;}';
    printHtml += '.logo { height: 75px;margin-top:5px;margin-left:5px;}';
    printHtml += '.school-name {display: flex; align-items: center; justify-content: center; text-align: center; }';
    printHtml += '.school-name h3 { color: #252525 !important; font-size: 18px !important;font-weight: bolder;margin-top:-115px !important; margin-bottom: 0 !important; }';

    printHtml += '.address{margin-top: -42px;}';
    printHtml += '.address p{font-size:10px;margin-top: -8px !important;}';
    printHtml += '.title-lable {text-align: center;margin-bottom: 15px;}';
    printHtml += '.title-lable p {color: #252525 !important;font-size: 15px;font-weight: bolder;letter-spacing: .5px;}';

    printHtml += '.info-table {width:100%;color: #252525 !important;border: none;font-size: 11px;margin-top: 1.5vh;margin-bottom: 2vh;display: inline-table;}';
    printHtml += '.table-container .info-table th, .table-container .info-table td{color: #252525 !important;text-align:left;padding-left:15px;padding-top:5px;}';
    printHtml += '.custom-table {width: 100%;color: #252525 !important;border-collapse:collapse;margin-bottom: 20px;display: inline-table;border-radius:5px}';
    printHtml += '.custom-table th{height: 31px;text-align: center;border:1px solid #9e9e9e;line-height:15px;font-size: 10px;}';
    printHtml += '.custom-table tr{height: 30px;}';
    printHtml += '.custom-table td {text-align: center;border:1px solid #9e9e9e;font-size: 10px;}';
    printHtml += '.text-bold { font-weight: bold;}';
    printHtml += '.text-left { text-align: left;}';
    printHtml += 'p {color: #252525 !important;font-size:12px;}'
    printHtml += 'h4 {color: #252525 !important;}'
    printHtml += '@media print {';
    printHtml += '  body::before {';
    printHtml += `    content: "${schoolName}, ${city}";`;
    printHtml += '    position: fixed;';
    printHtml += '    top: 40%;';
    printHtml += '    left:10%;';
    printHtml += '    font-size: 20px;';
    printHtml += '    text-transform: uppercase;';
    printHtml += '    font-weight: bold;';
    printHtml += '    font-family: Arial, sans-serif;';
    printHtml += '    color: rgba(0, 0, 0, 0.08);';
    printHtml += '    pointer-events: none;';
    printHtml += '  }';
    printHtml += '}';
    printHtml += '</style>';
    printHtml += '</head>';
    printHtml += '<body>';

    this.mappedResults.forEach((student, index) => {
      const studentElement = document.getElementById(`student-${student.studentId}`);
      if (studentElement) {
        printHtml += studentElement.outerHTML;

        // Add a page break after each student except the last one
        if (index < this.mappedResults.length - 1) {
          printHtml += '<div style="page-break-after: always;"></div>';
        }
      }
    });
    printHtml += '</body></html>';
    return printHtml;
  }

  chooseStream(stream: any) {
    if (this.theorySubjects || this.practicalSubjects || this.periodicTestSubjects || this.noteBookSubjects || this.subjectEnrichmentSubjects) {
      this.falseAllValue();
    }
    this.stream = stream;
    if (stream && this.cls) {
      let params = {
        adminId: this.adminId,
        cls: this.cls,
        stream: stream,
      }
      this.getSingleClassResultStrucByStream(params);
    }
  }

  selectExam(selectedExam: string) {
    if (this.theorySubjects || this.practicalSubjects || this.periodicTestSubjects || this.noteBookSubjects || this.subjectEnrichmentSubjects) {
      this.falseAllValue();
    }
    this.selectedExam = selectedExam;
    const examFilteredData = this.marksheetTemplateStructureInfo.marksheetTemplateStructure.examStructure[selectedExam];
    let subjects = this.marksheetTemplateStructureInfo.classSubjectList.subject;
    this.practicalSubjects = [];
    this.periodicTestSubjects = [];
    this.noteBookSubjects = [];
    this.subjectEnrichmentSubjects = [];
    this.coScholastic = [];
    this.discipline = [];

    if (examFilteredData.theoryMaxMarks) {
      this.theorySubjects = subjects.map((item: any) => {
        const theorySubject = Object.values(item)[0];
        return theorySubject;
      })
      if (this.theorySubjects) {
        this.patchTheory();
      }
    }
    if (examFilteredData.practicalMaxMarks) {
      this.practicalSubjects = subjects.map((item: any) => {
        const practicalSubject = Object.values(item)[0];
        return practicalSubject;
      })
      if (this.practicalSubjects) {
        this.patchPractical();
      }
    }
    if (examFilteredData.periodicTestMaxMarks) {
      this.periodicTestSubjects = subjects.map((item: any) => {
        const periodicTestSubject = Object.values(item)[0];
        return periodicTestSubject;
      })
      if (this.periodicTestSubjects) {
        this.patchPeriodicTest();
      }
    }


    if (examFilteredData.noteBookMaxMarks) {
      this.noteBookSubjects = subjects.map((item: any) => {
        const noteBookSubject = Object.values(item)[0];
        return noteBookSubject;
      })
      if (this.noteBookSubjects) {
        this.patchNoteBook();
      }
    }
    if (examFilteredData.subjectEnrichmentMaxMarks) {
      this.subjectEnrichmentSubjects = subjects.map((item: any) => {
        const subjectEnrichmentSubject = Object.values(item)[0];
        return subjectEnrichmentSubject;
      })
      if (this.subjectEnrichmentSubjects) {
        this.patchSubjectEnrichment();
      }
    }
    if (examFilteredData.coScholastic) {
      this.coScholastic = examFilteredData.coScholastic;
      if (this.coScholastic) {
        this.patchCoScholastic();
      }
    }
    if (examFilteredData.discipline) {
      this.discipline = examFilteredData.discipline;
      if (this.discipline) {
        this.patchDiscipline();
      }
    }

    this.resultStructureInfo = {

      practicalMaxMarks: this.practicalSubjects.map((subject: any) => ({ [subject]: examFilteredData.practicalMaxMarks })),
      noteBookMaxMarks: this.theorySubjects.map((subject: any) => ({ [subject]: examFilteredData.noteBookMaxMarks })),
      periodicTestMaxMarks: this.periodicTestSubjects.map((subject: any) => ({ [subject]: examFilteredData.periodicTestMaxMarks })),
      subjectEnrichmentMaxMarks: this.subjectEnrichmentSubjects.map((subject: any) => ({ [subject]: examFilteredData.subjectEnrichmentMaxMarks })),
      theoryMaxMarks: this.theorySubjects.map((subject: any) => ({ [subject]: examFilteredData.theoryMaxMarks })),
      theoryPassMarks: this.theorySubjects.map((subject: any) => ({ [subject]: examFilteredData.theoryPassMarks })),
      gradeMaxMarks: examFilteredData.gradeMaxMarks,
      gradeMinMarks: examFilteredData.gradeMinMarks
    };


  }


  getSingleClassResultStrucByStream(params: any) {
    this.examResultStructureService.getSingleClassResultStrucByStream(params).subscribe((res: any) => {
      if (res) {
        this.marksheetTemplateStructureInfo = res;
        this.examType = Object.keys(res.marksheetTemplateStructure.examStructure);
      }
    }, err => {
      this.falseAllValue();
    })
  }

  patchTheory() {
    const controlOne = <FormArray>this.examResultForm.get('type.theoryMarks');
    this.theorySubjects.forEach((x: any) => {
      controlOne.push(this.patchTheoryValues(x));
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
  patchPeriodicTest() {
    const controlOne = <FormArray>this.examResultForm.get('type.periodicTestMarks');
    this.periodicTestSubjects.forEach((x: any) => {
      controlOne.push(this.patchPeriodicTestValues(x))
      this.examResultForm.reset();
    })
  }
  patchNoteBook() {
    const controlOne = <FormArray>this.examResultForm.get('type.noteBookMarks');
    this.noteBookSubjects.forEach((x: any) => {
      controlOne.push(this.patchNoteBookValues(x))
      this.examResultForm.reset();
    })
  }
  patchSubjectEnrichment() {
    const controlOne = <FormArray>this.examResultForm.get('type.subjectEnrichmentMarks');
    this.subjectEnrichmentSubjects.forEach((x: any) => {
      controlOne.push(this.patchSubjectEnrichmentValues(x))
      this.examResultForm.reset();
    })
  }
  patchCoScholastic() {
    const controlOne = <FormArray>this.examResultForm.get('type.coScholastic');
    this.coScholastic.forEach((x: any) => {
      controlOne.push(this.patchCoScholasticValues(x))
      this.examResultForm.reset();
    })
  }
  patchDiscipline() {
    const controlOne = <FormArray>this.examResultForm.get('type.discipline');
    this.discipline.forEach((x: any) => {
      controlOne.push(this.patchDisciplineValues(x))
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
  patchPeriodicTestValues(periodicTestMarks: any) {
    return this.fb.group({
      [periodicTestMarks]: [periodicTestMarks],
    })
  }
  patchNoteBookValues(noteBookMarks: any) {
    return this.fb.group({
      [noteBookMarks]: [noteBookMarks],
    })
  }
  patchSubjectEnrichmentValues(subjectEnrichmentMarks: any) {
    return this.fb.group({
      [subjectEnrichmentMarks]: [subjectEnrichmentMarks],
    })
  }
  patchCoScholasticValues(coScholastic: any) {
    return this.fb.group({
      [coScholastic]: [coScholastic],
    })
  }
  patchDisciplineValues(discipline: any) {
    return this.fb.group({
      [discipline]: [discipline],
    })
  }

  examResultAddUpdate() {
    const examResult = this.examResultForm.value.type;
    const countSubjectsBelowPassingMarks = (passMarks: any[], actualMarks: any[]): number => {
      return passMarks.reduce((count, passMarkSubject, index) => {
        const subject = Object.keys(passMarkSubject)[0];
        const passMark = parseInt(passMarkSubject[subject], 10);
        const actualMark = actualMarks[index] ? parseInt(actualMarks[index][subject], 10) : 0;
        return actualMark < passMark ? count + 1 : count;
      }, 0);
    };
    const count = countSubjectsBelowPassingMarks(this.resultStructureInfo.theoryPassMarks, examResult.theoryMarks);
    const resultStatus = count === 0 ? 'PASS' : count <= 2 ? 'SUPPLY' : 'FAIL';
    const calculateMaxMarks = (marksArray: any[]): number => {
      return marksArray.reduce((total, subjectMarks) => {
        const subjectName = Object.keys(subjectMarks)[0];
        return total + parseFloat(subjectMarks[subjectName]);
      }, 0);
    };
    const totalTheoryMaxMarks = calculateMaxMarks(this.resultStructureInfo.theoryMaxMarks);
    const totalPracticalMaxMarks = this.resultStructureInfo.practicalMaxMarks ? calculateMaxMarks(this.resultStructureInfo.practicalMaxMarks) : 0;
    const totalPeriodicTestMaxMarks = this.resultStructureInfo.periodicTestMaxMarks ? calculateMaxMarks(this.resultStructureInfo.periodicTestMaxMarks) : 0;
    const totalNoteBookMaxMarks = this.resultStructureInfo.noteBookMaxMarks ? calculateMaxMarks(this.resultStructureInfo.noteBookMaxMarks) : 0;
    const totalSubjectEnrichmentMaxMarks = this.resultStructureInfo.subjectEnrichmentMaxMarks ? calculateMaxMarks(this.resultStructureInfo.subjectEnrichmentMaxMarks) : 0;

    const totalMaxMarks = totalTheoryMaxMarks + totalPracticalMaxMarks + totalPeriodicTestMaxMarks + totalNoteBookMaxMarks + totalSubjectEnrichmentMaxMarks;
    const calculateGrades = (subjectMarks: any[], isPractical: boolean, isPeriodicTest: boolean, isNoteBook: boolean, isSubjectEnrichment: boolean) => {
      return subjectMarks.map((subjectMark) => {
        const subjectName = Object.keys(subjectMark)[0];

        const theoryMarks = parseFloat(subjectMark[subjectName]);
        const practicalMarkObject = isPractical ? examResult.practicalMarks.find((practicalMark: any) => practicalMark && practicalMark.hasOwnProperty(subjectName)) : null;
        const practicalMarks = practicalMarkObject ? parseFloat(practicalMarkObject[subjectName]) : 0;

        const periodicTestMarkObject = isPeriodicTest ? examResult.periodicTestMarks.find((periodicTestMark: any) => periodicTestMark && periodicTestMark.hasOwnProperty(subjectName)) : null;
        const periodicTestMarks = periodicTestMarkObject ? parseFloat(periodicTestMarkObject[subjectName]) : 0;
        const noteBookMarkObject = isNoteBook ? examResult.noteBookMarks.find((noteBookMark: any) => noteBookMark && noteBookMark.hasOwnProperty(subjectName)) : null;
        const noteBookMarks = noteBookMarkObject ? parseFloat(noteBookMarkObject[subjectName]) : 0;
        const subjectEnrichmentMarkObject = isSubjectEnrichment ? examResult.subjectEnrichmentMarks.find((subjectEnrichmentMark: any) => subjectEnrichmentMark && subjectEnrichmentMark.hasOwnProperty(subjectName)) : null;
        const subjectEnrichmentMarks = subjectEnrichmentMarkObject ? parseFloat(subjectEnrichmentMarkObject[subjectName]) : 0;



        const totalMarks = theoryMarks + practicalMarks + periodicTestMarks + noteBookMarks + subjectEnrichmentMarks;

        const theoryMaxMarksObject = this.resultStructureInfo.theoryMaxMarks.find((theoryMaxMarks: any) => theoryMaxMarks && theoryMaxMarks.hasOwnProperty(subjectName));
        const theoryMaxMarks = theoryMaxMarksObject ? parseFloat(theoryMaxMarksObject[subjectName]) : 0;


        const practicalMaxMarksObject = isPractical && this.resultStructureInfo.practicalMaxMarks ? this.resultStructureInfo.practicalMaxMarks.find((practicalMaxMark: any) => practicalMaxMark && practicalMaxMark.hasOwnProperty(subjectName)) : null;
        const practicalMaxMarks = practicalMaxMarksObject ? parseFloat(practicalMaxMarksObject[subjectName]) : 0;


        const periodicTestMaxMarksObject = isPeriodicTest && this.resultStructureInfo.periodicTestMaxMarks ? this.resultStructureInfo.periodicTestMaxMarks.find((periodicTestMaxMark: any) => periodicTestMaxMark && periodicTestMaxMark.hasOwnProperty(subjectName)) : null;
        const periodicTestMaxMarks = periodicTestMaxMarksObject ? parseFloat(periodicTestMaxMarksObject[subjectName]) : 0;
        const noteBookMaxMarksObject = isNoteBook && this.resultStructureInfo.noteBookMaxMarks ? this.resultStructureInfo.noteBookMaxMarks.find((noteBookMaxMark: any) => noteBookMaxMark && noteBookMaxMark.hasOwnProperty(subjectName)) : null;
        const noteBookMaxMarks = noteBookMaxMarksObject ? parseFloat(noteBookMaxMarksObject[subjectName]) : 0;
        const subjectEnrichmentMaxMarksObject = isSubjectEnrichment && this.resultStructureInfo.subjectEnrichmentMaxMarks ? this.resultStructureInfo.subjectEnrichmentMaxMarks.find((subjectEnrichmentMaxMark: any) => subjectEnrichmentMaxMark && subjectEnrichmentMaxMark.hasOwnProperty(subjectName)) : null;
        const subjectEnrichmentMaxMarks = subjectEnrichmentMaxMarksObject ? parseFloat(subjectEnrichmentMaxMarksObject[subjectName]) : 0;



        const totalMaxMarks = theoryMaxMarks + practicalMaxMarks + periodicTestMaxMarks + noteBookMaxMarks + subjectEnrichmentMaxMarks;
        const totalGettingMarksPercentile = ((totalMarks / totalMaxMarks) * 100).toFixed(0);
        const gradeMaxMarks = this.resultStructureInfo.gradeMaxMarks;
        const gradeMinMarks = this.resultStructureInfo.gradeMinMarks;
        const grade = gradeMaxMarks.reduce((grade: string, gradeRange: any, i: number) => {
          const maxMarks = parseFloat(String(Object.values(gradeRange)[0]));
          const minMarks = parseFloat(String(Object.values(gradeMinMarks[i])[0]));
          return parseFloat(totalGettingMarksPercentile) >= minMarks && parseFloat(totalGettingMarksPercentile) <= maxMarks ? Object.keys(gradeRange)[0] : grade;
        }, '');
        return {
          subject: subjectName,
          theoryMarks: theoryMarks,
          practicalMarks: practicalMarks,
          periodicTestMarks: periodicTestMarks,
          noteBookMarks: noteBookMarks,
          subjectEnrichmentMarks: subjectEnrichmentMarks,
          totalMarks: totalMarks,
          grade: grade,
        };
      });
    };
    let marks = calculateGrades(examResult.theoryMarks, !!examResult.practicalMarks, !!examResult.periodicTestMarks, !!examResult.noteBookMarks, !!examResult.subjectEnrichmentMarks);
    const grandTotalMarks = marks.reduce((total: number, item: any) => total + item.totalMarks, 0);
    const percentile = parseFloat(((grandTotalMarks / totalMaxMarks) * 100).toFixed(2));
    const basePercentile = parseFloat(percentile.toFixed(0));
    const percentileGrade = this.resultStructureInfo.gradeMaxMarks.reduce((grade: string, gradeRange: any, i: number) => {
      const maxMarks = parseFloat(String(Object.values(gradeRange)[0]));
      const minMarks = parseFloat(String(Object.values(this.resultStructureInfo.gradeMinMarks[i])[0]));
      return basePercentile >= minMarks && basePercentile <= maxMarks ? Object.keys(gradeRange)[0] : grade;
    }, '');

    let emptyArrayProperties: any[] = [];
    for (let key in this.resultStructureInfo) {
      if (Array.isArray(this.resultStructureInfo[key]) && this.resultStructureInfo[key].length === 0) {
        let transformedKey = key.replace(/Max|Pass/, '');
        emptyArrayProperties.push(transformedKey);
      }
    }

    marks.forEach((subject: any) => {
      emptyArrayProperties.forEach(prop => {
        delete subject[prop];
      });
    });

    const coScholastic = examResult.coScholastic.map((activity: any) => {
      const activityName = Object.keys(activity)[0];
      const grade = activity[activityName];
      return {
        activity: activityName,
        grade: grade
      };
    });
    const discipline = examResult.discipline.map((discipline: any) => {
      const disciplineName = Object.keys(discipline)[0];
      const grade = discipline[disciplineName];
      return {
        discipline: disciplineName,
        grade: grade
      };
    })



    let examResultInfo = {
      marks: marks,
      grandTotalMarks: grandTotalMarks,
      totalMaxMarks: totalMaxMarks,
      percentile: percentile,
      percentileGrade: percentileGrade,
      resultStatus: resultStatus,
      coScholastic: coScholastic,
      discipline: discipline,
    };
    if (this.examResultForm.valid) {
      this.examResultForm.value.resultDetail = examResultInfo;
      this.examResultForm.value.adminId = this.adminId;
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
        this.examResultForm.value.createdBy = "Admin";
        this.examResultForm.value.examType = this.selectedExam;
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
      createdBy: "Admin",
      bulkResult: this.bulkResult
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