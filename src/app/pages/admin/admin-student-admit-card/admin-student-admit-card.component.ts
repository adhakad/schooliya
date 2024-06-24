import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatRadioChange } from '@angular/material/radio';
import { AdmitCardStructureService } from 'src/app/services/admit-card-structure.service';
import { AdmitCardService } from 'src/app/services/admit-card.service';
import { PrintPdfService } from 'src/app/services/print-pdf/print-pdf.service';
import { AdminAuthService } from 'src/app/services/auth/admin-auth.service';
import { SchoolService } from 'src/app/services/school.service';

@Component({
  selector: 'app-admin-student-admit-card',
  templateUrl: './admin-student-admit-card.component.html',
  styleUrls: ['./admin-student-admit-card.component.css']
})
export class AdminStudentAdmitCardComponent implements OnInit {

  allAdmitCards: any[] = [];
  allAdmitCardsByStream: any[] = [];
  cls: any;
  admitCardInfo: any;
  studentInfo: any;
  loader: Boolean = true;
  showModal: Boolean = false;
  admitCardStrInfo: any;
  admitCardStrInfoByStream: any;
  processedData: any[] = [];
  schoolInfo: any;
  baseURL!: string;
  selectedStream: string = '';
  streamSection: boolean = true;
  streamMainSubject: any[] = [];
  selectedValue: number = 0;
  adminId!:string;
  constructor(public activatedRoute: ActivatedRoute,private adminAuthService:AdminAuthService, private schoolService: SchoolService, private admitCardService: AdmitCardService, private printPdfService: PrintPdfService, private admitCardStructureService: AdmitCardStructureService) {

  }

  ngOnInit(): void {
    let getAdmin = this.adminAuthService.getLoggedInAdminInfo();
    this.adminId = getAdmin?.id;
    this.cls = this.activatedRoute.snapshot.paramMap.get('id');
    this.getStudentAdmitCardByClass(this.cls);
    this.getAdmitCardStructureByClass(this.cls);
    this.getSchool();
    var currentURL = window.location.href;
    this.baseURL = new URL(currentURL).origin;
  }
  onChange(event: MatRadioChange) {
    this.selectedValue = event.value;
  }
  closeModal() {
    this.showModal = false;
    this.streamSection = true;
    this.selectedStream = '';
    this.processedData = [];
  }
  bulkPrint() {
    if (this.cls <= 10 || this.cls == 200 || this.cls==201 || this.cls == 202) {
      this.selectedStream = 'N/A';
      this.admitCardStrInfoByStream = this.admitCardStrInfo.filter((item: any) => item.stream === 'N/A');
      this.processData(this.selectedStream);
    }
    this.showModal = true;
  }
  selectStream(subject: any) {
    this.selectedStream = subject;
    this.admitCardStrInfoByStream = this.admitCardStrInfo.filter((item: any) => item.stream === subject);
    this.processData(this.selectedStream);
    this.streamSection = false;
  }
  getAdmitCardStructureByClass(cls: any) {
    let params = {
      class:cls,
      adminId:this.adminId
    }
    this.admitCardStructureService.admitCardStructureByClass(params).subscribe((res: any) => {
      if (res) {
        this.admitCardStrInfo = res;
        for(let i=0;i<res.length;i++){
          this.streamMainSubject.push(res[i].stream);
        }
      }
    })
  }
  getSchool() {
    this.schoolService.getSchool(this.adminId).subscribe((res: any) => {
      if (res) {
        this.schoolInfo = res;
      }
    })
  }
  printStudentData() {
    if (this.selectedValue==0) {
      const printContent = this.getPrintOneAdmitCardContent();
      this.printPdfService.printContent(printContent);
    }
    if(this.selectedValue==1){
      const printContent = this.getPrintTwoAdmitCardContent();
      this.printPdfService.printContent(printContent);
    }
    this.closeModal();
  }
  private getPrintOneAdmitCardContent(): string {
    let schoolName = this.schoolInfo.schoolName;
    let city = this.schoolInfo.city;
    let printHtml = '<html>';
    printHtml += '<head>';
    printHtml += '<style>';
    printHtml += 'body { margin: 0; padding: 0; }';
    printHtml += 'div { margin: 0; padding: 0;}';
    printHtml += '.custom-container {font-family: Arial, sans-serif;overflow: auto;}';
    printHtml += '.table-container {background-color: #fff;border: none;}';
    printHtml += '.logo { height: 75px;margin-right:10px; }';
    printHtml += '.school-name {display: flex; align-items: center; justify-content: center; text-align: center; }';
    printHtml += '.school-name h3 { color: #2e2d6a !important; font-size: 18px !important;margin-top:-120px !important; margin-bottom: 0 !important; }';
    printHtml += '.address{margin-top: -45px;}';
    printHtml += '.address p{margin-top: -10px !important;}';

    printHtml += '.info-table {width:100%;color: #2e2d6a !important;border: none;font-size: 12px;letter-spacing: .25px;margin-top: 1.5vh;margin-bottom: 2vh;display: inline-table;}';
    printHtml += '.table-container .info-table th, .table-container .info-table td{color: #2e2d6a !important;text-align:center}';
    printHtml += '.title-lable {max-height: 45px;text-align: center;margin-bottom: 15px;border:1px solid #2e2d6a;border-radius: 5px;margin-top: 25px;}';
    printHtml += '.title-lable p {color: #2e2d6a !important;font-size: 15px;font-weight: 500;letter-spacing: 1px;}';
    printHtml += '.codes .school-code  {margin-right:65%;}';
    printHtml += '.custom-table {width: 100%;color: #2e2d6a !important;border-collapse:collapse;font-size: 12px;letter-spacing: .25px;margin-bottom: 20px;display: inline-table;border-radius:5px}';
    printHtml += '.custom-table th{height:38px;text-align: center;border:1px solid #2e2d6a;}';
    printHtml += '.custom-table tr{height:38px;}';
    printHtml += '.custom-table td {text-align: center;border:1px solid #2e2d6a;}';
    printHtml += '.text-bold { font-weight: bold;}';
    printHtml += 'p {color: #2e2d6a !important;font-size:12px;}'
    printHtml += 'h4 {color: #2e2d6a !important;}'
    printHtml += '@media print {';
    printHtml += '  body::before {';
    printHtml += `    content: "${schoolName}, ${city}";`;
    printHtml += '    position: fixed;';
    printHtml += '    top: 40%;';
    printHtml += '    left:10%;';
    printHtml += '    font-size: 20px;';
    printHtml += '    font-weight: bold;';
    printHtml += '    font-family: Arial, sans-serif;';
    printHtml += '    color: rgba(0, 0, 0, 0.08);';
    printHtml += '    pointer-events: none;';
    printHtml += '  }';
    printHtml += '}';
    printHtml += '</style>';
    printHtml += '</head>';
    printHtml += '<body>';

    this.allAdmitCards.forEach((student, index) => {
      const studentElement = document.getElementById(`student-${student.studentId}`);
      if (studentElement) {
        printHtml += studentElement.outerHTML;

        // Add a page break after each student except the last one
        if (index < this.allAdmitCards.length - 1) {
          printHtml += '<div style="page-break-after: always;"></div>';
        }
      }
    });
    printHtml += '</body></html>';
    return printHtml;
  }

  private getPrintTwoAdmitCardContent(): string {
    let schoolName = this.schoolInfo.schoolName;
    let city = this.schoolInfo.city;
    let printHtml = '<html>';
    printHtml += '<head>';
    printHtml += '<style>';
    printHtml += 'body { margin: 0; padding: 0; }';
    printHtml += 'div { margin: 0; padding: 0;}';
    printHtml += '.custom-container {font-family: Arial, sans-serif;overflow: auto;}';
    printHtml += '.table-container {background-color: #fff;border: none;}';
    printHtml += '.school-name {display: flex; align-items: center; justify-content: center; text-align: center; }';
    printHtml += '.address{margin-top: -46px;}';
    printHtml += '.address p{margin-top: -10px !important;}';
    printHtml += '.logo { height: 75px;margin-right:10px; }';
    printHtml += '.school-name h3 { color: #2e2d6a !important; font-size: 18px !important;margin-top:-120px !important; margin-bottom: 0 !important; }';
    printHtml += '.info-table {width:100%;color: #2e2d6a !important;border: none;font-size: 12px;letter-spacing: .25px;margin-top: 5px;margin-bottom: 15px;display: inline-table;}';
    printHtml += '.table-container .info-table th, .table-container .info-table td{color: #2e2d6a !important;text-align:center}';
    printHtml += '.title-lable {text-align: center;border-radius: 5px;margin-top:10px;margin-bottom:10px;}';
    printHtml += '.title-lable p {color: #2e2d6a !important;font-size: .9rem;font-weight: 500;letter-spacing: .8px;}';
    printHtml += '.codes .school-code  {margin-right:65%;}';
    printHtml += '.custom-table {width: 100%;color: #2e2d6a !important;border-collapse:collapse;font-size: 12px;letter-spacing: .25px;margin-bottom: 20px;display: inline-table;border-radius:5px;}';
    printHtml += '.custom-table th{height:26px;text-align: center;border:1px solid #2e2d6a;}';
    printHtml += '.custom-table tr{height:26px;}';
    printHtml += '.custom-table td {text-align: center;border:1px solid #2e2d6a;}';
    printHtml += '.text-bold { font-weight: bold;}';
    printHtml += 'p {color: #2e2d6a !important;font-size:12px;}'
    printHtml += 'h4 {color: #2e2d6a !important;}'
    printHtml += '.watermark { position: fixed;font-family: Arial, sans-serif; font-size: 20px; font-weight: bold; color: rgba(0, 0, 0, 0.03); top: 75%; left:10%; pointer-events: none; z-index: 1; }';
    printHtml += '@media print {';
    printHtml += '  body::before {';
    printHtml += `    content: "${schoolName}, ${city}";`;
    printHtml += '    position: fixed;';
    printHtml += '    top: 25%;';
    printHtml += '    left:10%;';
    printHtml += '    font-size: 20px;';
    printHtml += '    font-weight: bold;';
    printHtml += '    font-family: Arial, sans-serif;';
    printHtml += '    color: rgba(0, 0, 0, 0.08);';
    printHtml += '    pointer-events: none;';
    printHtml += '  }';
    printHtml += '}';
    printHtml += '</style>';
    printHtml += '</head>';
    printHtml += '<body>';

    for (let i = 0; i < this.allAdmitCards.length; i += 2) {
      const student1 = this.allAdmitCards[i];
      const student2 = i + 1 < this.allAdmitCards.length ? this.allAdmitCards[i + 1] : null;

      printHtml += `<div class="watermark">${schoolName}, ${city}</div>`;
      // Print details for the first student
      printHtml += this.getStudentHtml(student1);

      // Add a page break after the first student if there is a second student
      if (student2) {
        printHtml += '<div style="page-break-after: always;"></div>';
        // Print details for the second student
        printHtml += this.getStudentHtml(student2);
      }
    }

    printHtml += '</body></html>';
    return printHtml;
  }

  private getStudentHtml(student: any): string {
    const studentElement = document.getElementById(`student-${student.studentId}`);
    if (studentElement) {
      return studentElement.outerHTML;
    }
    return '';
  }

  processData(selectedStream: any) {
    this.allAdmitCardsByStream = this.allAdmitCards.filter((item: any) => item.stream === selectedStream);
    for (let i = 0; i < this.admitCardStrInfoByStream[0].examDate.length; i++) {
      const subject = Object.keys(this.admitCardStrInfoByStream[0].examDate[i])[0];
      const date = Object.values(this.admitCardStrInfoByStream[0].examDate[i])[0];
      const startTime = Object.values(this.admitCardStrInfoByStream[0].examStartTime[i])[0];
      const endTime = Object.values(this.admitCardStrInfoByStream[0].examEndTime[i])[0];

      this.processedData.push({
        subject,
        date,
        timing: `${startTime} to ${endTime}`
      });
    }
  }

  getStudentAdmitCardByClass(cls: any) {
    let params = {
      class:cls,
      adminId:this.adminId,
    }
    this.admitCardService.getAllStudentAdmitCardByClass(params).subscribe((res: any) => {
      if (res) {
        this.admitCardInfo = res.admitCardInfo;
        this.studentInfo = res.studentInfo;
        const studentInfoMap = new Map();
        this.studentInfo.forEach((item: any) => {
          studentInfoMap.set(item._id, item);
        });

        const combinedData = this.admitCardInfo.reduce((result: any, admitCard: any) => {
          const studentInfo = studentInfoMap.get(admitCard.studentId);

          if (studentInfo) {
            result.push({
              studentId: admitCard.studentId,
              class: admitCard.class,
              stream: admitCard.stream,
              examType: admitCard.examType,
              status: admitCard.status || "",
              name: studentInfo.name,
              fatherName: studentInfo.fatherName,
              motherName: studentInfo.motherName,
              rollNumber: studentInfo.rollNumber,
              admissionNo: studentInfo.admissionNo
            });
          }

          return result;
        }, []);
        if (combinedData) {
          this.allAdmitCards = combinedData;
          setTimeout(() => {
            this.loader = false;
          }, 1000)
        }
      }
    })
  }

  changeStatus(id: any, statusValue: any) {
    if (id) {
      let params = {
        id: id,
        statusValue: statusValue,
      }
      this.admitCardService.changeStatus(params).subscribe((res: any) => {
        if (res) {
          this.getStudentAdmitCardByClass(this.cls);
        }
      })
    }
  }
}
