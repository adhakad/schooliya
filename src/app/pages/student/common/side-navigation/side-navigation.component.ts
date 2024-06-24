import { Component, OnInit } from '@angular/core';
import { StudentAuthService } from 'src/app/services/auth/student-auth.service';

@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.css']
})
export class SideNavigationComponent implements OnInit {

  constructor(private studentAuthService:StudentAuthService) { }

  ngOnInit(): void {
  }

  

}
