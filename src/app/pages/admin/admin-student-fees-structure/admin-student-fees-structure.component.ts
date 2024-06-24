import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { FeesStructureService } from 'src/app/services/fees-structure.service';
import { AdminAuthService } from 'src/app/services/auth/admin-auth.service';
import { SchoolService } from 'src/app/services/school.service';

@Component({
  selector: 'app-admin-student-fees-structure',
  templateUrl: './admin-student-fees-structure.component.html',
  styleUrls: ['./admin-student-fees-structure.component.css']
})
export class AdminStudentFeesStructureComponent implements OnInit {
  disabled = true;
  // installment: boolean = false;
  // monthly: boolean = false;


  cls: any;
  feesForm: FormGroup;
  showModal: boolean = false;
  showFeesStructureModal: boolean = false
  deleteMode: boolean = false;
  updateMode: boolean = false;
  deleteById: String = '';
  successMsg: String = '';
  errorMsg: String = '';
  errorCheck: Boolean = false;

  totalFees: number = 0;

  selectedFeesType: any[] = [];
  // selectedFeesPayType: any[] = [];
  // checkFeesPayType: boolean = false;
  feesTypeMode: boolean = false;
  feesMode: boolean = false;
  clsFeesStructure: any;
  particularsAdmissionFees: any[] = [];
  feePerticulars: any[] = ['Registration', 'Tution', 'Books', 'Uniform', 'Examination','Sports','Library','Transport'];
  schoolInfo: any;
  loader: Boolean = true;
  adminId!:string;
  constructor(private fb: FormBuilder, public activatedRoute: ActivatedRoute,private adminAuthService:AdminAuthService,private schoolService: SchoolService, private feesStructureService: FeesStructureService) {
    this.feesForm = this.fb.group({
      adminId:[''],
      admissionFees: ['', Validators.required],
      type: this.fb.group({
        feesType: this.fb.array([], [Validators.required]),
        // feesPayType: this.fb.array([], [Validators.required]),
      }),
    });
  }

  ngOnInit(): void {
    this.getSchool();
    let getAdmin = this.adminAuthService.getLoggedInAdminInfo();
    this.adminId = getAdmin?.id;
    this.cls = this.activatedRoute.snapshot.paramMap.get('id');
    this.getFeesStructureByClass(this.cls);
    setTimeout(() => {
      this.loader = false;
    }, 1000);
  }
  getSchool() {
    this.schoolService.getSchool(this.adminId).subscribe((res: any) => {
      if (res) {
        this.schoolInfo = res;
      }
    })
  }
  getFeesStructureByClass(cls: any) {
    let params = {
      class:cls,
      adminId:this.adminId,
    }
    this.feesStructureService.feesStructureByClass(params).subscribe((res: any) => {
      if (res) {
        this.errorMsg='';
        this.clsFeesStructure = res;
        this.particularsAdmissionFees = [{ Admission: res.admissionFees }, ...res.feesType];
      }
    },err => {
      this.errorMsg = err.error;
    })
  }
  // installmentPayment() {
  //   this.checkFeesPayType = true;
  //   this.monthly = false;
  //   this.installment = true;
  //   this.selectedFeesPayType = [];
  //   this.selectedFeesPayType = ['First', 'Second', 'Third'];
  // }
  // monthlyPayment() {
  //   this.checkFeesPayType = true;
  //   this.installment = false;
  //   this.monthly = true;
  //   this.selectedFeesPayType = [];
  //   this.selectedFeesPayType = ['July', 'August', 'September', 'October', 'November', 'December', 'January', 'Fabruary', 'March', 'April'];
  // }
  addFeesModel() {
    this.showModal = true;
    this.feesTypeMode = true;
    this.feesForm.reset();
  }
  openFeesStructureModal(){
    this.showFeesStructureModal = true;
  }
  selectFeesStructure() {
    this.feesTypeMode = false;
    this.feesMode = true;
    this.patch();
  }

  falseAllValue() {
    // this.installment = false;
    // this.monthly = false;

    this.totalFees = 0;
    this.selectedFeesType = [];
    // this.selectedFeesPayType = [];
    const controlOne = <FormArray>this.feesForm.get('type.feesType');
    // const controlSecond = <FormArray>this.feesForm.get('type.feesPayType');
    controlOne.clear();
    // controlSecond.clear();
    // this.checkFeesPayType = false;
    this.feesTypeMode = false;
    this.feesMode = false;

  }

  closeModal() {
    this.falseAllValue();
    this.showModal = false;
    this.deleteMode = false;
    this.errorMsg = '';
    this.errorCheck = false
    this.showFeesStructureModal = false;
    this.feesForm.reset();
  }
  deleteFeesStructureModel(id: String) {
    this.showModal = true;
    this.deleteMode = true;
    this.deleteById = id;
  }

  successDone() {
    setTimeout(() => {
      this.closeModal();
      this.successMsg = '';
      this.getFeesStructureByClass(this.cls);
      console.log(this.cls)
    }, 1000)
  }


  feesType(option: any) {
    const index = this.selectedFeesType.indexOf(option);
    if (index > -1) {
      this.selectedFeesType.splice(index, 1);
    } else {
      this.selectedFeesType.push(option)
    }
  }

  patch() {
    const controlOne = <FormArray>this.feesForm.get('type.feesType');
    this.selectedFeesType.forEach((x: any) => {
      controlOne.push(this.patchFeesTypeValues(x))
      this.feesForm.reset();
    })
  }

  patchFeesTypeValues(selectedFeesType: any) {
    return this.fb.group({
      [selectedFeesType]: [selectedFeesType]
    })
  }

  feesStructureAddUpdate() {
    this.feesForm.value.adminId = this.adminId;
    this.feesForm.value.class = this.cls;
    this.feesForm.value.totalFees = this.totalFees;
    let feesTypeObj = this.feesForm.value.type.feesType;
  
    let containsFeesTypeNull = feesTypeObj.some((item: any) => Object.values(item).includes(null));
    if (containsFeesTypeNull) {
      this.errorCheck = true;
      this.errorMsg = 'Please fill all fields';
    }
    if (!containsFeesTypeNull) {
      this.feesStructureService.addFeesStructure(this.feesForm.value).subscribe((res: any) => {
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
  feesStructureDelete(id: String) {
    this.feesStructureService.deleteFeesStructure(id).subscribe((res: any) => {
      if (res) {
        this.successDone();
        this.getFeesStructureByClass(this.cls);
        this.successMsg = res;
        this.deleteById = '';
      }
    })
  }

}
