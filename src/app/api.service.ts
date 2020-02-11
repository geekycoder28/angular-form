import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable()

export class ApiService {

  constructor(private _httpClient: HttpClient) { 
 
  }
  
  public getFormURL(AuthKey,FormID){
  
    var _url = 'https://wc.visitingaid.com/Form.svc/REST/GetFormURL/'+AuthKey+'/'+FormID;
     
    return this._httpClient.get(_url); 
  
  }

  public saveDataWC(AuthKey,FormID,EntityID,formData){
 
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    let params = new HttpParams().set("FormData", encodeURIComponent(formData));

    return this._httpClient.get('https://wc.visitingaid.com/Form.svc/REST/SaveForm/'+AuthKey+'/'+FormID+'/'+EntityID, {params: params}); 
  
  }
   
}
