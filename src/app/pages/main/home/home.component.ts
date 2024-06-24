
import { Component, Inject, OnInit, PLATFORM_ID, AfterViewInit, ElementRef } from '@angular/core';
declare var jQuery: any;
import { isPlatformBrowser } from '@angular/common';
import { Banner } from 'src/app/modal/banner.model';
import { Teacher } from 'src/app/modal/teacher.model';
import { Ads } from 'src/app/modal/ads.model';
import { Topper } from 'src/app/modal/topper.model';
import { Testimonial } from 'src/app/modal/testimonial.model';
import { environment } from 'src/environments/environment';
import { AdminAuthService } from 'src/app/services/auth/admin-auth.service';
import { BannerService } from 'src/app/services/banner.service';
import { AdsService } from 'src/app/services/ads.service';
import { TopperService } from 'src/app/services/topper.service';
import { PlansService } from 'src/app/services/plans.service';
import { TestimonialService } from 'src/app/services/testimonial.service';
import { StudentAuthService } from 'src/app/services/auth/student-auth.service';
import { PrintPdfService } from 'src/app/services/print-pdf/print-pdf.service';
import { SchoolService } from 'src/app/services/school.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  private isBrowser: boolean = isPlatformBrowser(this.platformId);
  public baseUrl = environment.API_URL;
  bannerInfo: any[] = [];
  teacherInfo: any[] = [];
  adsInfo: any[] = [];
  topperInfo: any[] = [];
  plansInfo: any[] = [];
  testimonialInfo: any[] = [];
  cls: number = 0;
  loggedInStudentInfo: any;
  no: number = 0;
  loadTitle = false;
  loader: Boolean = true;
  schoolInfo: any;
  showModal: Boolean = false;
  students = [
    { id: 1, name: 'Student 1' },
    { id: 2, name: 'Student 2' },
    // Add more students as needed
  ];

  adminId!:any;
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private el: ElementRef,private adminAuthService:AdminAuthService, private schoolService: SchoolService, private printPdfService: PrintPdfService, private plansService: PlansService, private bannerService: BannerService, private topperService: TopperService, private testimonialService: TestimonialService, private adsService: AdsService, private studentAuthService: StudentAuthService) { }

  async ngOnInit() {
    let getAdmin = this.adminAuthService.getLoggedInAdminInfo();
    this.adminId = getAdmin?.id;
    this.getLoggedInStudentInfo();
    this.getPlans();
    this.getBanner();
    this.getAds()
    this.getTestimonial();
    this.getTopper();
  }

  getLoggedInStudentInfo() {
    this.loggedInStudentInfo = this.studentAuthService.getLoggedInStudentInfo();
    if (this.loggedInStudentInfo) {
      this.cls = this.loggedInStudentInfo?.class;
    }
  }
  ngAfterViewInit() {
    if (this.isBrowser) {

      setTimeout(() => {
        jQuery('.banner-carousel').owlCarousel({
          items: 1,
          autoplay: true,
          slideTransition: 'linear',
          autoplayTimeout: 0,
          autoplaySpeed: 3000,
          autoplayHoverPause: false,
          loop: true,
          dots: false,
          margin: 0,
          nav: false,
          responsiveClass: true,
          lazyLoad: true,
        });
        // jQuery('.topper-carousel').owlCarousel({
        jQuery(this.el.nativeElement).find('.topper-carousel').owlCarousel({
          items: 3,
          dots: false,
          nav: false,
          loop: true,
          autoplay: true,
          autoplayTimeout: 5000,
          autoplaySpeed: 1500,
          responsiveClass: true,
          lazyLoad: true,
          margin: 115,
          responsive: {
            600: {
              items: 6,
              margin: 100
            },
            1500: {
              items: 6,
              margin: 100,
            },
          }
        });
        jQuery('.ads-carousel').owlCarousel({
          stagePadding: 25,
          items: 1,
          margin: 10,
          loop: true,
          autoplay: true,
          autoplayTimeout: 5000,
          autoplayHoverPause: false,
          dots: false,
          nav: false,
          responsiveClass: true,
          responsive: {
            600: {
              stagePadding: 65,
              items: 2,
              margin: 40,
            },
            1500: {
              stagePadding: 65,
              items: 3,
              margin: 40,
            },
          }
        });
        jQuery('.testimonial-carousel').owlCarousel({
          stagePadding: 30,
          items: 1,
          loop: false,
          dots: false,
          nav: true,
          responsiveClass: true,
          navText: [
            "<button style='position:absolute;left:-10px;background:#8c88ff3d;color:#4e4caacd;border:none;border-radius:50%;width:30px;height:30px;top:50%;transform:translateY(-50%);'><mat-icon style='margin-top:2px;margin-left:-3px;' class='material-icons'>keyboard_arrow_left</mat-icon></button>",
            "<button style='position:absolute;right:-10px;background:#8c88ff3d;color:#4e4caacd;border:none;border-radius:50%;width:30px;height:30px;top:50%;transform:translateY(-50%);'><mat-icon style='margin-top:2px;margin-left:-3px;' class='material-icons'>keyboard_arrow_right</mat-icon></button>"
          ],
          responsive: {
            600: {
              stagePadding: 50,
              items: 3,
            },
            1500: {
              stagePadding: 50,
              items: 4,
            },
          }
        });
        setTimeout(() => {
          this.loader = false;
        }, 500)
      }, 3000);

    }
  }
  getPlans() {
    this.plansService.getPlansList().subscribe((res: any[]) => {
      if (res) {
        this.plansInfo = res;
        console.log(this.plansInfo)
      }
    })
  }
  getBanner() {
    this.schoolService.getSchool(this.adminId).subscribe((res: any) => {
      if (res) {
        this.schoolInfo = res;
      }
    })
    this.bannerService.getBannerList().subscribe((res: any[]) => {
      if (res) {
        this.bannerInfo = res;
      }
    })
  }
  getTopper() {
    this.topperService.getTopperList().subscribe((res: any[]) => {
      if (res) {
        this.topperInfo = res;
        setTimeout(() => {
          this.loadTitle = true;
        }, 1500)
      }
    })
  }
  getAds() {
    this.adsService.getAdsList().subscribe((res: any[]) => {
      if (res) {
        this.adsInfo = res;
      }
    })
  }

  getTestimonial() {
    this.testimonialService.getTestimonialList().subscribe((res: any[]) => {
      if (res) {
        this.testimonialInfo = res;
      }
    })
  }








  closeModal() {
    this.showModal = false;
  }
  bulkPrint() {
    this.showModal = true;
  }
  printStudentData() {
    const printContent = this.getPrintContent();
    this.printPdfService.printContent(printContent);
  }
  private getPrintContent(): string {
    let printHtml = '<html>';
    printHtml += '<head>';
    printHtml += '<style>';
    printHtml += 'body { margin: 0; padding: 0; }'; // Set body styles and hide horizontal overflow
    printHtml += 'div { margin: 0; padding: 0;}';
    printHtml += '.custom-container {font-family: Arial, sans-serif;overflow: auto;}';
    printHtml += '.table-container {background-color: #fff;border: none;}';
    printHtml += '.school-name {display: flex; align-items: center; justify-content: center; text-align: center; }';
    printHtml += '.address{margin-top: -65px;}';
    printHtml += '.address p{margin-top: -5px !important;}';
    printHtml += '.logo { height: 100px; }';
    printHtml += '.school-name h3 { color: #2e2d6a !important; font-size: 20px !important; margin-left: 15px;margin-top:-65px !important; margin-bottom: 0 !important; }';
    printHtml += '.info-table {width:100%;color: #2e2d6a !important;border: none;font-size: 1em;letter-spacing: .25px;margin-top: 5vh;margin-bottom: 5vh;display: inline-table;}';
    printHtml += '.table-container .info-table th, .table-container .info-table td{color: #2e2d6a !important;text-align:center}';
    printHtml += '.title-lable {max-height: 45px;text-align: center;margin-bottom: 15px;border:1px solid #2e2d6a;border-radius: 5px;margin-top: 25px;}';
    printHtml += '.title-lable p {color: #2e2d6a !important;font-size: 16px;font-weight: bold;letter-spacing: 1px;}';
    printHtml += '.codes .school-code  {margin-right:65%;}';
    // printHtml += '.codes .school-aff p {margin-right:65%;}';
    printHtml += '.custom-table {width: 100%;color: #2e2d6a !important;border-collapse:collapse;font-size: 1em;letter-spacing: .25px;margin-bottom: 20px;display: inline-table;border-radius:5px}';
    printHtml += '.custom-table th{height:38px;text-align: center;border:1px solid #2e2d6a;}';
    printHtml += '.custom-table tr{height:38px;}';
    printHtml += '.custom-table td {text-align: center;border:1px solid #2e2d6a;}';
    printHtml += '.text-bold { font-weight: bold;}';
    printHtml += 'p {color: #2e2d6a !important;font-size:12px;}'
    printHtml += 'h4 {color: #2e2d6a !important;}'

    printHtml += '@media print {';
    printHtml += '  body::after {';
    printHtml += '    content: "GUNA PUBLIC HIGHER SECONDARY SCHOOL";'; // Change "Watermark" to your desired text or image
    printHtml += '    position: fixed;';
    printHtml += '    top: 45%;';
    printHtml += '    left:10%;';
    // printHtml += '    transform: translate(-50%, -50%);';
    printHtml += '    font-size: 20px;';
    printHtml += '    font-weight: bold;';
    printHtml += '    font-family: Arial, sans-serif;';
    printHtml += '    color: rgba(0, 0, 0, 0.1);';
    printHtml += '    pointer-events: none;';
    printHtml += '  }';
    printHtml += '}';
    // Add your additional styles here
    printHtml += '</style>';
    printHtml += '</head>';
    printHtml += '<body>';

    this.students.forEach((student, index) => {
      const studentElement = document.getElementById(`student-${student.id}`);
      if (studentElement) {
        printHtml += studentElement.outerHTML;

        // Add a page break after each student except the last one
        if (index < this.students.length - 1) {
          printHtml += '<div style="page-break-after: always;"></div>';
        }
      }
    });

    printHtml += '</body></html>';

    return printHtml;
  }
}
