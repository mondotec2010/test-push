import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, concat } from 'rxjs';
import { DistributionList, DistributionListUser } from '../model/distributionList';
import { environment } from 'src/environments/environment';
import { Lista } from '../model/lista';
import { catchError, tap, delay, take, last, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DistributionListService {

  url = environment.baseUrl;

  constructor( 
    private http: HttpClient
    ) { }

  // ------------------------------------- DistributionList ------------------------------------- //

  // getDistributionLists():Observable<DistributionList[]> {
  //   return this.http.get<DistributionList[]>(`${this.url}/distribution/getAllDistributionsList`);
  // }

  getDistributionLists():Observable<Lista[]> {
    return this.http.get<Lista[]>(`${this.url}/v4/uop/distlists/`);
  }

  getDistributionListsBySender(senderId: number): Observable<Lista[]> {
    return this.http.get<Lista[]>(`${this.url}/v4/uop/distlists/${senderId}`);
  }

  getDevicesOfList(id: string):Observable<String[]> {
    return this.http.get<String[]>(`${this.url}/v4/uop/distlists/devcode/${id}`);
  }

  deviceValidation(deviceCode: String):Observable<DistributionList[]> {
    return this.http.get<DistributionList[]>(`${this.url}/v4/uop/device/${deviceCode}`);
  }

  getDistributionList(id : string):Observable<DistributionList> {
    return this.http.get<DistributionList>(`${this.url}/distribution/getDistributionList`, {
      params: { 'distributionId': id }
    });
  }

  // createDistributionList(distributionList: DistributionList){
  //   return this.http.post(`${this.url}/distribution/createDistributionList`, distributionList);
  // }

  createDistributionList(distributionList: any){
    return this.http.post(`${this.url}/v4/uop/distlists/`, distributionList);
  }

  ////////////////////////////
  modifyDistributionList(listId: string, name: string, oldDevices: string[], newDevices: string[]){
    console.log("oldDevices: ");
    console.log(oldDevices);
    console.log("newDevices: ");
    console.log(newDevices);
    return concat(this.modifyNameDistributionList(listId, name), ...this.modifyDevicesDistributionList(listId, oldDevices, newDevices)).pipe(last(),
      catchError( (err)=>{
        throw err;
      } ));
  }
  modifyNameDistributionList(listId: string, name: string){
    let body = `name=${name}`;
    return this.http.put<any>(`${environment.baseUrl}/v4/uop/distlists/${listId}`, body, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
    }).pipe(
      catchError( (err)=>{
        throw err;
      } ));
  }
  modifyDevicesDistributionList(listId: string, oldDevices: string[], newDevices: string[]){
    //elimina tutti i device della vecchia lista
    let toDeleteDevices: string[] = oldDevices.filter(s => !newDevices.includes(s));
    console.log("devices to delete");
    console.log(toDeleteDevices);
    //let body1 = {"devCodeList": toDeleteDevices};
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {"devCodeList": toDeleteDevices}
    }
    const deleteObs = this.http.delete<any>(`${environment.baseUrl}/v4/uop/distlists/devcode/${listId}`, options);
    // const deleteObs = oldDevices.map((device)=>{ 
    //   let body = new FormData();
    //   body.append('devCode', device);
    //   return this.http.post<any>(`${environment.baseUrl}/v4/uop/distlists/delete_devcode_from_distlist/${listId}`, body).pipe(
    //     tap( () => console.log("deleted one") ),
    //     catchError( (err)=>{
    //       throw err;
    //     } ))
    // });
    //aggiungi tutti i device della nuova lista
    let toAddDevices: string[] = newDevices.filter(s => !oldDevices.includes(s));
    console.log("devices to add");
    console.log(toAddDevices);
    let body2 = {"devCodeList": toAddDevices};
    const addObs = this.http.post<any>(`${environment.baseUrl}/v4/uop/distlists/devcode/${listId}`, body2)
    // const addObs = newDevices.map((device)=>{ 
    //   let body = new FormData();
    //   body.append('devCode', device);
    //   return this.http.put<any>(`${environment.baseUrl}/v4/uop/distlists/add_devcode/${listId}`, body).pipe(
    //     tap( () => console.log("added one") ),
    //     catchError( (err)=>{
    //       throw err;
    //     } ))
    // });
    const result = [deleteObs, addObs];
    // const observable = forkJoin(result);
    // console.log("result: ");
    // console.log(result);
    // console.log("observable: ");
    // console.log(observable);
    return result;
  }
  ////////////////////////////

  updateDistributionList(distributionList: DistributionList) {
    return this.http.put(`${this.url}/distribution/updateDistributionList`, distributionList);
  }

  deleteDistributionList(listId: string){
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.delete(`${this.url}/v4/uop/distlists/${listId}`,
      { headers, responseType: 'text' });
  }

  // ------------------------------------- DistributionListUser ------------------------------------- //

  getDistributionListUsers(listId: string): Observable<DistributionListUser[]> {
    return this.http.get<DistributionListUser[]>(`${this.url}/distribution/getDistributionListUsers` , {
      params: {'listId': listId }
    });
  }

  getDistributionListUser(userId: string): Observable<DistributionListUser> {
    return this.http.get<DistributionListUser>(`${this.url}/distribution/getDistributionListUser` , {
      params: {'userId': userId }
    });
  }

  createDistributionListUser(distributionListUser: DistributionListUser){
    return this.http.post(`${this.url}/distribution/createDistributionListUser`, distributionListUser);
  }

  updateDistributionListUser(distributionListUser: DistributionListUser){
    return this.http.put(`${this.url}/distribution/updateDistributionListUser`, distributionListUser);
  }

  deleteDistributionListUser(distributionListUser: DistributionListUser){
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: distributionListUser
    }
    return this.http.delete(`${this.url}/distribution/deleteDistributionListUser`, options);
  }

}
