import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AdminAuthService } from 'src/app/services/auth/admin-auth.service';
import { ClassSubjectService } from 'src/app/services/class-subject.service';
import { AdmitCardStructureService } from 'src/app/services/admit-card-structure.service';

@Component({
  selector: 'app-admin-student-admit-card-structure',
  templateUrl: './admin-student-admit-card-structure.component.html',
  styleUrls: ['./admin-student-admit-card-structure.component.css']
})
export class AdminStudentAdmitCardStructureComponent implements OnInit {
  cls: any;
  admitcardForm: FormGroup;
  showModal: boolean = false;
  showAdmitCardStructureModal: boolean = false;
  updateMode: boolean = false;
  deleteMode: boolean = false;
  deleteById: String = '';
  successMsg: String = '';
  errorMsg: String = '';
  errorCheck: Boolean = false;
  classSubject: any[] = [];
  examAdmitCard: any[] = [];
  admitCardInfo: any;
  processedData: any[] = [];
  stream: string = '';
  notApplicable: String = "stream";
  examTypes: any[] = ["quarterly", "half yearly", "final"];
  streamMainSubject: any[] = ['Mathematics(Science)', 'Biology(Science)', 'History(Arts)', 'Sociology(Arts)', 'Political Science(Arts)', 'Accountancy(Commerce)', 'Economics(Commerce)', 'Agriculture', 'Home Science'];
  examTime: any[] = ["8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM"];
  loader: Boolean = true;
  adminId!: string;
  constructor(private fb: FormBuilder, public activatedRoute: ActivatedRoute, private adminAuthService: AdminAuthService, private classSubjectService: ClassSubjectService, private admitCardStructureService: AdmitCardStructureService) {
    this.admitcardForm = this.fb.group({
      adminId:[''],
      class: [''],
      examType: ['', Validators.required],
      stream: [''],
      type: this.fb.group({
        examDate: this.fb.array([], [Validators.required]),
        startTime: this.fb.array([], [Validators.required]),
        endTime: this.fb.array([], [Validators.required]),
      }),
    });
  }

  ngOnInit(): void {
    let getAdmin = this.adminAuthService.getLoggedInAdminInfo();
    this.adminId = getAdmin?.id;
    this.cls = this.activatedRoute.snapshot.paramMap.get('id');
    this.getAdmitCardStructureByClass(this.cls);
  }

  falseFormValue() {
    const controlOne = <FormArray>this.admitcardForm.get('type.examDate');
    const controlTwo = <FormArray>this.admitcardForm.get('type.startTime');
    const controlThree = <FormArray>this.admitcardForm.get('type.endTime');
    controlOne.clear();
    controlTwo.clear();
    controlThree.clear();
    this.admitcardForm.reset();
  }
  falseAllValue() {
    this.falseFormValue();
    this.stream = '';
    this.classSubject = [];
    this.admitcardForm.reset();
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
        if (this.classSubject) {
          this.patch();

        }
      }
      if (!res) {
        this.classSubject = [];
      }
    })
  }

  getAdmitCardStructureByClass(cls: any) {
    let params = {
      class:cls,
      adminId:this.adminId,
    }
    this.admitCardStructureService.admitCardStructureByClass(params).subscribe((res: any) => {
      if (res) {
        this.examAdmitCard = res;
        console.log(this.examAdmitCard)
        setTimeout(() => {
          this.loader = false;
        }, 1000)
        // let date = new Date();
        // let examDate: any = this.examAdmitCard[0]?.examDate;

        // // Convert the date strings to Date objects
        // const datesAsObjects = examDate?.map((entry: any) => {
        //   const subject = Object.keys(entry)[0];
        //   const dateParts = entry[subject].split('.');
        //   const dateObject = new Date(
        //     parseInt(dateParts[2], 10),
        //     parseInt(dateParts[1], 10) - 1,
        //     parseInt(dateParts[0], 10)
        //   );
        //   return { subject, date: dateObject };
        // });

        // // Sort the dates in ascending order
        // datesAsObjects?.sort((a: any, b: any) => a.date - b.date);

        // // Get the last date
        // const lastDate = datesAsObjects[datesAsObjects?.length - 1];



        // console.log(lastDate)
        // console.log(date)


        // const date1 = lastDate;
        // const date2 = date;

        // // Set the time components of both dates to zero
        // const newDate1 = new Date(date1);
        // newDate1.setHours(0, 0, 0, 0);

        // const newDate2 = new Date(date2);
        // newDate2.setHours(0, 0, 0, 0);

        // // Compare the dates
        // if (newDate1.getTime() === newDate2.getTime()) {
        //   console.log('The dates are equal.');
        // } else if (newDate1.getTime() < newDate2.getTime()) {
        //   console.log('date1 is before date2.');
        // } else {
        //   console.log('date1 is after date2.');
        // }




        // // const dateString: string = "20.07.2023";
        // // const [day, month, year]: number[] = dateString.split(".").map(Number);
        // // const dateObject: Date = new Date(year, month - 1, day);
        // // const timestamp: number = Math.floor(dateObject.getTime() / 1000);

        // // console.log(timestamp);

      }
    })
  }
  processData(examAdmitCard: any) {
    for (let i = 0; i < examAdmitCard.examDate.length; i++) {
      const subject = Object.keys(examAdmitCard.examDate[i])[0];
      const date = Object.values(examAdmitCard.examDate[i])[0];
      const startTime = Object.values(examAdmitCard.examStartTime[i])[0];
      const endTime = Object.values(examAdmitCard.examEndTime[i])[0];

      this.processedData.push({
        subject,
        date,
        timing: `${startTime} to ${endTime}`
      });
    }
  }

  addAdmitCardModel() {
    this.showModal = true;
  }
  openAdmitCardStructureModal(examAdmitCard: any) {
    this.showAdmitCardStructureModal = true;
    this.admitCardInfo = examAdmitCard;
    this.processData(examAdmitCard);
  }
  deleteAdmitCardStructureModel(id: String) {
    this.showModal = true;
    this.deleteMode = true;
    this.deleteById = id;
  }

  closeModal() {
    this.showModal = false;
    this.errorMsg = '';
    this.deleteMode = false;
    this.deleteById = '';
    this.showAdmitCardStructureModal = false;
    this.admitCardInfo;
    this.processedData = [];
    this.falseAllValue();
    this.admitcardForm.reset();
  }
  successDone() {
    setTimeout(() => {
      this.closeModal();
      this.successMsg = '';
      this.getAdmitCardStructureByClass(this.cls);
    }, 1000)
  }

  patch() {
    const controlOne = <FormArray>this.admitcardForm.get('type.examDate');
    this.classSubject.forEach((x: any) => {
      controlOne.push(this.patchExamDate(x.subject))
      this.admitcardForm.reset();
    })

    const controlTwo = <FormArray>this.admitcardForm.get('type.startTime');
    this.classSubject.forEach((x: any) => {
      controlTwo.push(this.patchStartTime(x.subject))
      this.admitcardForm.reset();
    })
    const controlThree = <FormArray>this.admitcardForm.get('type.endTime');
    this.classSubject.forEach((x: any) => {
      controlThree.push(this.patchEndTime(x.subject))
      this.admitcardForm.reset();
    })
  }
  patchExamDate(examDate: any) {
    return this.fb.group({
      [examDate]: [examDate],
    })
  }
  patchStartTime(startTime: any) {
    return this.fb.group({
      [startTime]: [startTime],
    })
  }

  patchEndTime(endTime: any) {
    return this.fb.group({
      [endTime]: [endTime],
    })
  }

  admitcardAddUpdate() {
    this.admitcardForm.value.type.examDate = this.admitcardForm.value.type.examDate.map((exam: any) => {
      const subject = Object.keys(exam)[0];
      const dateStr = exam[subject];
      const dateObj = new Date(dateStr);
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      const formattedDate = `${day}.${month}.${year}`;
      return { [subject]: formattedDate };
    });
    this.admitcardForm.value.adminId = this.adminId;
    this.admitcardForm.value.class = this.cls;
    this.admitcardForm.value.stream = this.stream;
    let examDateObj = this.admitcardForm.value.type.examDate;
    let startTimeObj = this.admitcardForm.value.type.startTime;
    let endTimeObj = this.admitcardForm.value.type.endTime;
    let containsExamDateNull = examDateObj.some((item: any) => Object.values(item).includes(null));
    let containsStartTimeNull = startTimeObj.some((item: any) => Object.values(item).includes(null));
    let containsEndTimeNull = endTimeObj.some((item: any) => Object.values(item).includes(null));
    if (containsExamDateNull || containsStartTimeNull || containsEndTimeNull) {
      this.errorCheck = true;
      this.errorMsg = 'Please fill all fields';
    }
    if (!containsExamDateNull && !containsStartTimeNull && !containsEndTimeNull) {
      this.admitCardStructureService.addAdmitCardStructure(this.admitcardForm.value).subscribe((res: any) => {
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

  onToggleChange(id: any, admitCardPublishStatus: any) {
    let params = {
      id: id,
      admitCardPublishStatus: admitCardPublishStatus
    }
    this.admitCardStructureService.changeAdmitCardPublishStatus(params)
      .subscribe(
        (response: any) => {
        },
        error => {
          console.log(error)
        }
      );
  }

  admitCardStructureDelete(id: String) {
    this.admitCardStructureService.deleteAdmitCardStructure(id).subscribe((res: any) => {
      if (res) {
        this.successDone();
        this.successMsg = res;
        this.deleteById = '';
      }
    })
  }

}