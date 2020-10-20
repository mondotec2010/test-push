import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Sender } from '../model/sender';
import { Category } from '../model/category';
import { Area } from '../model/area';
//import { JobZone, JobPoint, JobDistributionList } from '../model/job';
import { JobZone, JobPoint, JobList } from '../model/job';
import { CapXmlRequest } from 'src/app/model/cap/capXmlRequest';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UploadResult } from '../model/uploadResult';
import { TranslateService } from '@ngx-translate/core';
import { Message } from '../model/message';
import { NewArea } from '../model/areaCoords';
import { FileInput } from 'ngx-material-file-input';
import { CapMessage } from '../model/cap/jsonMapper';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  multimedia: File; // Perchè? A che serve?

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) { }

  getSenderList(): Observable<Sender[]> {
    return this.http.get<Sender[]>(`${environment.baseUrl}/v4/uop/users/senders`);
  }

  getCategoryList(senderId: number): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.baseUrl}/v4/uop/senders/${senderId}/categories`)
      .pipe(map((categories: Category[]) => {
        for (const category of categories) {
          for (const categoryTranslate of category.categoryTranslates) {
            if (categoryTranslate.lang === this.translate.getDefaultLang().toUpperCase()) {
              category.category = categoryTranslate.description;
            }
          }
        }
        return categories;
      }));
  }

  getLanguages(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/v4/uop/languages`);
  }

  getCategory(senderId: string, categoryId: string): Observable<Category> {
    return this.http.get<Category>(`${environment.baseUrl}/v4/uop/senders/categories/${categoryId}`).pipe(map(category => {
      for (const categoryTranslate of category.categoryTranslates) {
        if (categoryTranslate.lang === this.translate.getDefaultLang().toUpperCase()) {
          category.category = categoryTranslate.description;
        }
      }
      return category;
    }));
  }

  getAreaList(senderId: number): Observable<Area[]> {
    return this.http.get<Area[]>(`${environment.baseUrl}/v4/uop/senders/${senderId}/areas`)
      .pipe(map((areas: Area[]) => {
        // console.log(areas)
        return areas;
      }));
  }

  getMessageList(): Observable<Message[]> {
    return this.http.get<Message[]>(`${environment.baseUrl}/v4/uop/messages`).pipe(map((message: Message[]) => {
      return message;
    }))
  }

  getMessage(id: string): Observable<Message> {
    return this.http.get<Message>(`${environment.baseUrl}/v4/uop/messages/${id}`);
  }

  createJobZoneCap(jobZone: JobZone) {
    return this.http.post<any>(`${environment.baseUrl}/v4/uop/capit`, jobZone);
  }

  createJobList(jobZone: JobList) {
    return this.http.post<any>(`${environment.baseUrl}/v4/uop/messages/bydistlist`, jobZone);
  }

  createJobPoint(jobPoint: JobPoint) {
    return this.http.post<any>(`${environment.baseUrl}/v4/uop/messages/byradius`, jobPoint);
  }

  uploadMultimediaFile(file: FileInput, senderId: number) {
    const formData: FormData = new FormData();
    formData.append('file', file.files[0], file.files[0].name);
    //formData.append('mail', mail);
    return this.http.post<UploadResult>(`${environment.baseUrl}/v4/uop/senders/${senderId}/media/upload`, formData);
  }

  downloadMultimediaFile(senderEmail: string, fileName: string): Observable<any> {
    return this.http.get(`${environment.baseUrl}/v1/downloadFile/` + `${fileName}`, {
      params: { 'mail': senderEmail },
      responseType: "blob"
    })
  }

  terminateMessage(id: string) {
    return this.http.put(`${environment.baseUrl}/v4/uop/messages/${id}/terminate`, null)
  }

  prorogateMessage(id: string, newEndDate: string) {
    let body = `updateEndDate=${newEndDate}`;
    return this.http.post(`${environment.baseUrl}/v4/uop/messages/${id}/update-expiration`, body, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
    })
  }

  createArea(area: NewArea): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}/senders/createArea`, area);
  }


  sendCapMessage(message : CapMessage):Observable<any>{
    return this.http.post(`${environment.baseUrl}/v4/uop/capit`, message);
  }
}
