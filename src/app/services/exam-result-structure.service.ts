import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExamResultStructureService {
  url = `${environment.API_URL}/v1/exam-result-structure`;
  constructor(private http: HttpClient) { }

  addExamResultStructure(examResultForm:any) {
    return this.http.post(`${this.url}`,examResultForm);
  }
  examResultStructureByClass(params: any) {
    return this.http.get(`${this.url}/admin/${params.adminId}/class/${params.class}`);
  }
  getSingleClassResultStrucByStream(params: any) {
    return this.http.get(`${this.url}/admin/${params.adminId}/class/${params.cls}/stream/${params.stream}/exam/${params.examType}`);
  }
  changeResultPublishStatus(params:any){
    return this.http.put(`${this.url}/result-publish-status/${params.id}`,params);
  }
  deleteResultStructure(id:any){
    return this.http.delete(`${this.url}/${id}`);
  }
}
