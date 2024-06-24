import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { read, utils, writeFile } from 'xlsx';
import * as ExcelJS from 'exceljs';
import { Subject } from 'rxjs';
import { StudentService } from 'src/app/services/student.service';
import { ClassService } from 'src/app/services/class.service';
import { MatRadioChange } from '@angular/material/radio';
import { ExcelService } from 'src/app/services/excel/excel.service';
import { SchoolService } from 'src/app/services/school.service';
import { HttpClient } from '@angular/common/http';
import { PrintPdfService } from 'src/app/services/print-pdf/print-pdf.service';
import { AdminAuthService } from 'src/app/services/auth/admin-auth.service';
import { ClassSubjectService } from 'src/app/services/class-subject.service';
import { IssuedTransferCertificateService } from 'src/app/services/issued-transfer-certificate.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  @ViewChild('content') content!: ElementRef;
  studentForm: FormGroup;
  excelForm: FormGroup;
  studentClassPromoteForm: FormGroup;
  tcForm: FormGroup;
  showModal: boolean = false;
  showBulkImportModal: boolean = false;
  showBulkExportModal: boolean = false;
  showClassPromoteModal: boolean = false;
  showStudentInfoViewModal: boolean = false;
  showStudentTCModal: boolean = false;
  updateMode: boolean = false;
  deleteMode: boolean = false;
  deleteById: String = '';
  successMsg: String = '';
  errorMsg: String = '';
  errorCheck: Boolean = false;
  classInfo: any[] = [];
  studentInfo: any[] = [];
  studentInfoByClass: any[] = [];
  recordLimit: number = 10;
  filters: any = {};
  number: number = 0;
  paginationValues: Subject<any> = new Subject();
  page: Number = 0;
  selectedValue: number = 0;

  sessions: any;
  categorys: any;
  religions: any;
  qualifications: any;
  occupations: any;
  stream: string = '';
  notApplicable: String = "stream";
  streamMainSubject: any[] = ['Mathematics(Science)', 'Biology(Science)', 'History(Arts)', 'Sociology(Arts)', 'Political Science(Arts)', 'Accountancy(Commerce)', 'Economics(Commerce)', 'Agriculture', 'Home Science'];
  cls: number = 0;
  className: any;
  admissionType: string = '';
  schoolInfo: any;
  bulkStudentRecord: any;
  fileChoose: boolean = false;
  loader: Boolean = true;
  promotedClass: any;
  singleStudentInfo: any
  singleStudentTCInfo: any
  classSubject: any[] = [];
  serialNo!: number;
  isDate: string = '';
  readyTC: Boolean = false;
  baseURL!: string;
  adminId!:String
  constructor(private fb: FormBuilder, public activatedRoute: ActivatedRoute, private printPdfService: PrintPdfService, private schoolService: SchoolService, public ete: ExcelService,private adminAuthService:AdminAuthService, private issuedTransferCertificate: IssuedTransferCertificateService, private classService: ClassService, private classSubjectService: ClassSubjectService, private studentService: StudentService) {
    this.studentForm = this.fb.group({
      _id: [''],
      adminId:[''],
      session: ['', Validators.required],
      admissionNo: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      admissionType: ['', Validators.required],
      class: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      admissionClass: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      stream: ['', Validators.required],
      rollNumber: ['', [Validators.required, Validators.maxLength(8), Validators.pattern('^[0-9]+$')]],
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')]],
      dob: ['', Validators.required],
      doa: ['', Validators.required],
      aadharNumber: ['', [Validators.required, Validators.pattern('^\\d{12}$')]],
      samagraId: ['', [Validators.required, Validators.pattern('^\\d{9}$')]],
      gender: ['', Validators.required],
      category: ['', Validators.required],
      religion: ['', Validators.required],
      nationality: ['', Validators.required],
      contact: ['', [Validators.required, Validators.pattern('^[6789]\\d{9}$')]],
      address: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$'), Validators.maxLength(50)]],
      lastSchool: ['', [Validators.pattern('^[a-zA-Z\\s]+$'), Validators.maxLength(50)]],
      fatherName: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')]],
      fatherQualification: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')]],
      fatherOccupation: ['', Validators.required],
      fatherContact: ['', [Validators.required, Validators.pattern('^[6789]\\d{9}$')]],
      fatherAnnualIncome: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      motherName: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')]],
      motherQualification: ['', Validators.required],
      motherOccupation: ['', Validators.required],
      motherContact: ['', [Validators.required, Validators.pattern('^[6789]\\d{9}$')]],
      motherAnnualIncome: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      discountAmountInFees:[''],
      createdBy: [''],
    })

    this.excelForm = this.fb.group({
      excelData: [null]
    });

    this.studentClassPromoteForm = this.fb.group({
      _id: ['', Validators.required],
      adminId:[''],
      class: [''],
      session: ['', Validators.required],
      admissionNo: ['', Validators.required],
      rollNumber: ['', Validators.required],
      stream: ['', Validators.required],
      createdBy:['']
    })

    this.tcForm = this.fb.group({
      lastExamStatus: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')]],
      reasonForLeaving: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')]],
      totalWorkingDays: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      totalPresenceDays: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      generalConduct: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')]],
      anyOtherRemarks: ['',],
    })
  }

  ngOnInit(): void {
    let getAdmin = this.adminAuthService.getLoggedInAdminInfo();
    this.adminId = getAdmin?.id;
    this.className = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.className) {
      let load: any = this.getStudents({ page: 1 });
      if (load) {
        setTimeout(() => {
          this.loader = false;
        }, 1000);
      }
    }
    this.getSchool();
    this.getClass();
    this.allOptions();
    var currentURL = window.location.href;
    this.baseURL = new URL(currentURL).origin;
  }
  printContent(singleStudentInfo: any) {
    singleStudentInfo.serialNo = this.serialNo;
    this.issuedTransferCertificate.createTransferCertificate(singleStudentInfo).subscribe((res: any) => {
      if (res == 'IssueTransferCertificate') {
        this.printPdfService.printElement(this.content.nativeElement)
        this.closeModal();
        this.getStudents({ page: this.page });
      }
    }, err => {
      this.errorCheck = true;
      this.errorMsg = err.error;
    })
  }
  getSchool() {
    this.schoolService.getSchool(this.adminId).subscribe((res: any) => {
      if (res) {
        this.schoolInfo = res;
      }
    })
  }
  chooseAdmissionType(event: any) {
    if (event) {
      if (event.value == 'New') {
        this.admissionType = event.value;
        const admissionNo = Math.floor(Math.random() * 89999999 + 10000000);
        this.studentForm.get('admissionNo')?.setValue(admissionNo);
      }
      if (event.value == 'Old') {
        this.admissionType = event.value;
        this.studentForm.get('admissionNo')?.setValue(null);
      }
    }
  }
  chooseClass(cls: any) {
    this.cls = cls;
    if(cls<11 && cls!==0 || cls == 200 || cls==201 || cls==202){
      this.studentForm.get('stream')?.setValue("N/A");
    }
  }
  chooseStream(event: any) {
    this.stream = event.value;
  }

  date(e: any) {
    var convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.studentForm.get('dob')?.setValue(convertDate, {
      onlyself: true,
    });
  }
  onChange(event: MatRadioChange) {
    this.selectedValue = event.value;
  }
  closeModal() {
    this.showModal = false;
    this.showBulkImportModal = false;
    this.showBulkExportModal = false;
    this.showClassPromoteModal = false;
    this.showStudentInfoViewModal = false;
    this.showStudentTCModal = false;
    this.updateMode = false;
    this.deleteMode = false;
    this.fileChoose = false;
    this.errorCheck = false;
    this.readyTC = false;
    this.errorMsg = '';
    this.successMsg = '';
    this.stream = '';
    this.cls = 0;
    this.classSubject = [];
    this.promotedClass;
    this.singleStudentInfo;
    this.singleStudentTCInfo;
    this.admissionType = '';
    this.studentForm.reset();
    this.studentClassPromoteForm.reset();
    this.excelForm.reset();
    this.tcForm.reset();
  }
  addStudentModel() {
    this.showModal = true;
    this.deleteMode = false;
    this.updateMode = false;
    this.studentForm.reset();
  }
  addBulkStudentImportModel() {
    this.showBulkImportModal = true;
    this.errorCheck = false;
  }
  addBulkStudentExportModel() {
    this.showBulkExportModal = true;
    this.errorCheck = false;
    this.getStudentByClass(this.className);
  }
  addStudentClassPromoteModel(student: any) {
    this.showClassPromoteModal = true;
    this.singleStudentInfo = student;
    this.studentClassPromoteForm.patchValue(student);
    this.studentClassPromoteForm.get('stream')?.setValue(null);
  }
  addStudentInfoViewModel(student: any) {
    this.showStudentInfoViewModal = true;
    this.singleStudentInfo = student;
  }
  addStudentTCModel(student: any) {
    this.showStudentTCModal = true;
    this.singleStudentInfo = student;
    let stream: String = student.stream;
    if (stream == "N/A") {
      stream = this.notApplicable;
    }
    let params = {
      cls: student.class,
      stream: stream,
      adminId:this.adminId,
    }
    this.getSingleClassSubjectByStream(params);
  }
  updateStudentModel(student: any) {
    this.showModal = true;
    this.deleteMode = false;
    this.updateMode = true;
    this.studentForm.patchValue(student);
  }
  deleteStudentModel(id: String) {
    this.showModal = true;
    this.updateMode = false;
    this.deleteMode = true;
    this.deleteById = id;
  }

  getClass() {
    this.classService.getClassList().subscribe((res: any) => {
      if (res) {
        this.classInfo = res;
      }
    })
  }
  getSingleClassSubjectByStream(params: any) {
    this.classSubjectService.getSingleClassSubjectByStream(params).subscribe((res: any) => {
      if (res) {
        this.classSubject = res.subject;
      }
      if (!res) {
        this.classSubject = [];
      }
    })
  }
  successDone() {
    setTimeout(() => {
      this.closeModal();
      this.successMsg = '';
      this.getStudents({ page: this.page });
    }, 1000)
  }

  getStudentByClass(cls: any) {
    let params = {
      class:cls,
      adminId:this.adminId,
    }
    this.studentService.getStudentByClass(params).subscribe((res: any) => {
      if (res) {
        this.studentInfoByClass = res;
        const classMappings: any = {
          200: "Nursery",
          201: "LKG",
          202: "UKG",
          1: "1st",
          2: "2nd",
          3: "3rd",
        };
        for (let i = 4; i <= 12; i++) {
          classMappings[i] = i + "th";
        }
        this.studentInfoByClass.forEach((student) => {
          student.class = classMappings[student.class] || "Unknown";
          student.admissionClass = classMappings[student.admissionClass] || "Unknown";
        });
      }
    })
  }
  getStudents($event: any) {
    this.page = $event.page
    return new Promise((resolve, reject) => {
      let params: any = {
        filters: {},
        page: $event.page,
        limit: $event.limit ? $event.limit : this.recordLimit,
        adminId:this.adminId,
        class: this.className
      };
      this.recordLimit = params.limit;
      if (this.filters.searchText) {
        params["filters"]["searchText"] = this.filters.searchText.trim();
      }

      this.studentService.studentPaginationList(params).subscribe((res: any) => {
        if (res) {
          this.studentInfo = res.studentList;
          this.serialNo = res.serialNo;
          this.isDate = res.isDate;
          this.number = params.page;
          this.paginationValues.next({ type: 'page-init', page: params.page, totalTableRecords: res.countStudent });
          return resolve(true);
        }
      });
    });
  }

  studentAddUpdate() {
    if (this.studentForm.valid) {
      this.studentForm.value.adminId = this.adminId;
      this.studentForm.value.discountAmountInFees = 500;
      if (this.updateMode) {
        this.studentService.updateStudent(this.studentForm.value).subscribe((res: any) => {
          if (res) {
            this.successDone();
            this.successMsg = res;
          }
        }, err => {
          this.errorCheck = true;
          this.errorMsg = err.error;
        })
      } else {
        this.studentForm.value.admissionType = 'Old';
        this.studentForm.value.createdBy = 'Admin';
        this.studentService.addStudent(this.studentForm.value).subscribe((res: any) => {
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
      this.studentService.changeStatus(params).subscribe((res: any) => {
        if (res) {
          this.getStudents({ page: this.page });
        }
      })
    }
  }
  studentDelete(id: String) {
    this.studentService.deleteStudent(id).subscribe((res: any) => {
      if (res) {
        this.successDone();
        this.successMsg = res;
        this.deleteById = '';
      }
    })
  }

  handleImport(event: any): void {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      const arrayBuffer = e.target.result;
      this.parseExcel(arrayBuffer);
    };
    fileReader.readAsArrayBuffer(file);
  }

  parseExcel(arrayBuffer: any): void {
    const workbook = new ExcelJS.Workbook();
    workbook.xlsx.load(arrayBuffer).then((workbook) => {
      const worksheet = workbook.getWorksheet(1);
      const data: any = [];
      worksheet!.eachRow({ includeEmpty: false }, (row: any, rowNumber) => {
        // Assuming the first row contains headers
        if (rowNumber === 1) {
          const headers = row.values.map(String);
          data.push(headers);
        } else {
          const rowData = row.values.map(String);
          data.push(rowData);
        }
      });
      const lastIndex = data.length - 1;
      const indexesToDelete = [0, lastIndex];
      // IndexesToDelete ke hisab se elements ko delete karna
      indexesToDelete.sort((a, b) => b - a); // Sort indexesToDelete in descending order
      indexesToDelete.forEach((index) => {
        data.splice(index, 1);
      });
      const fields = data[0];
      // Data ke baki ke rows
      const dataRows = data.slice(1);
      // Data ko objects mein map karna
      const mappedData = dataRows.map((row: any) => {
        const obj: any = {};
        fields.forEach((field: any, index: any) => {
          obj[field] = row[index];
        });
        return obj;
      });

      function transformKeys(dataArray: any) {
        return dataArray.map((obj: any) => {
          const newObj: any = {};
          for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
              const newKey = key.replace(/\s+/g, ''); // Remove spaces
              newObj[newKey.charAt(0).toLowerCase() + newKey.slice(1)] = obj[key];
            }
          }
          return newObj;
        });
      }
      // Transform the keys of the array
      const transformedDataArray = transformKeys(mappedData);
      if (transformedDataArray.length > 100) {
        this.fileChoose = false;
        this.errorCheck = true;
        this.errorMsg = 'File too large, Please make sure that file records to less then or equals to 100';
      }
      if (transformedDataArray.length <= 100) {
        this.bulkStudentRecord = transformedDataArray;
        this.fileChoose = true;
        this.errorCheck = false;
        this.errorMsg = '';
      }
    });
  }
  addBulkStudentRecord() {
    let studentRecordData = {
      bulkStudentRecord: this.bulkStudentRecord,
      class: this.className,
      adminId:this.adminId,
      createdBy: 'Admin',

    }
    if (studentRecordData) {
      this.studentService.addBulkStudentRecord(studentRecordData).subscribe((res: any) => {
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


  async exportToExcel() {
    let className = this.className;
    if (className == 1) {
      className = `${this.className}st`;
    }
    if (className == 2) {
      className = `${this.className}nd`;
    }
    if (className == 3) {
      className = `${this.className}rd`;
    }
    if (className >= 4 && className <= 12) {
      className = `${this.className}th`;
    }
    if (className == 200) {
      className = `Nursery`;
    }
    if (className == 201) {
      className = `LKG`;
    }
    if (className == 202) {
      className = `UKG`;
    }
    const header: string[] = [
      'admissionNo',
      'name',
      'fatherName',
      'motherName',
      'rollNumber',
      'class',
      'stream',
      'aadharNumber',
      'samagraId',
      'dob',
      'doa',
      'session',
      'admissionType',
      'admissionClass',
      'gender',
      'category',
      'religion',
      'nationality',
      'contact',
      'address',
      'fatherQualification',
      'fatherOccupation',
      'fatherContact',
      'fatherAnnualIncome',
      'motherQualification',
      'motherOccupation',
      'motherContact',
      'motherAnnualIncome',
    ];

    function orderObjectsByHeaders(studentInfoByClass: any, header: any) {
      return studentInfoByClass.map((obj: any) => {
        const orderedObj: any = {};
        header.forEach((header: any) => {
          orderedObj[header] = obj[header];
        });
        return orderedObj;
      });
    }
    const orderedData = await orderObjectsByHeaders(this.studentInfoByClass, header);
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let currentYear = (new Date()).getFullYear();
    let currentMonth = (new Date()).getMonth();
    let currentMonthText = months[currentMonth];
    const modifiedHeader = header.map(field => {
      // Capitalize the first letter and add a space before each capital letter (except the first character)
      return field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    });
    let reportData = {
      title: `${this.schoolInfo?.schoolName} Student Record Class - ${className} , ${currentMonthText} ${currentYear}`,
      data: orderedData,
      headers: modifiedHeader,
      fileName: `Student Record Class - ${className} , ${currentMonthText} ${currentYear} , ${this.schoolInfo?.schoolName}`,
    };

    this.ete.exportExcel(reportData);
    this.successDone();
  }

  allOptions() {
    this.sessions = [{ year: '2023-24' }, { year: '2024-25' }, { year: '2025-26' }, { year: '2026-27' }, { year: '2027-28' }, { year: '2028-29' }, { year: '2029-30' }]
    this.categorys = [{ category: 'General' }, { category: 'OBC' }, { category: 'SC' }, { category: 'ST' }, { category: 'Other' }]
    this.religions = [{ religion: 'Hinduism' }, { religion: 'Buddhism' }, { religion: 'Christanity' }, { religion: 'Jainism' }, { religion: 'Sikhism' }, { religion: 'Muslim' }, { religion: 'Other' }]
    this.qualifications = [{ qualification: 'Doctoral Degree' }, { qualification: 'Masters Degree' }, { qualification: 'Graduate Diploma' }, { qualification: 'Graduate Certificate' }, { qualification: 'Graduate Certificate' }, { qualification: 'Bachelor Degree' }, { qualification: 'Advanced Diploma' }, { qualification: 'Primary School' }, { qualification: 'High School' }, { qualification: 'Higher Secondary School' }, { qualification: 'Illiterate' }, { qualification: 'Other' }]
    this.occupations = [{ occupation: 'Agriculture(Farmer)' }, { occupation: 'Laborer' }, { occupation: 'Self Employed' }, { occupation: 'Private Job' }, { occupation: 'State Govt. Employee' }, { occupation: 'Central Govt. Employee' }, { occupation: 'Military Job' }, { occupation: 'Para-Military Job' }, { occupation: 'PSU Employee' }, { occupation: 'Other' }]
  }

  studentClassPromote() {
    if (this.studentClassPromoteForm.valid) {
      this.studentClassPromoteForm.value.adminId = this.adminId;
      this.studentClassPromoteForm.value.class = parseInt(this.className);
      this.studentForm.value.createdBy = 'Admin';
      this.studentService.studentClassPromote(this.studentClassPromoteForm.value).subscribe((res: any) => {
        if (res) {
          setTimeout(() => {
            this.successDone();
          }, 2000)
          this.promotedClass;
          this.promotedClass = res.className;
          this.successMsg = res.successMsg;
        }
      }, err => {
        this.errorCheck = true;
        this.promotedClass;
        if (err.error.className) {
          this.promotedClass = parseInt(err.error.className);
        }
        this.errorMsg = err.error.errorMsg;
      })
    }
  }
  getTC() {
    if (this.tcForm.valid && this.singleStudentInfo) {
      this.singleStudentInfo.isDate = this.isDate;
      if (!this.tcForm.value.anyOtherRemarks) {
        this.tcForm.value.anyOtherRemarks = 'Nil';
      }
      this.singleStudentTCInfo = { ...this.singleStudentInfo, ...this.tcForm.value }
      this.readyTC = true;
    }

  }



  // studentClassPromote() {
  //   if (this.studentClassPromoteForm.valid) {
  //     this.studentClassPromoteForm.value.class = parseInt(this.className);
  //     this.studentService.studentClassPromote(this.studentClassPromoteForm.value).subscribe((res: any) => {
  //       if (res) {
  //         setTimeout(() => {
  //           this.successDone();
  //         }, 2000)
  //         this.promotedClass;
  //         this.promotedClass = res.className;
  //         this.successMsg = res.successMsg;
  //       }
  //     }, err => {
  //       this.errorCheck = true;
  //       this.promotedClass;
  //       if (err.error.className) {
  //         this.promotedClass = parseInt(err.error.className);
  //       }
  //       this.errorMsg = err.error.errorMsg;
  //     })
  //   }
  // }
}