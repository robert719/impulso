import {Consultant} from './consultant';
import 'rxjs/Rx';
import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs';

import { AuthHttp } from 'angular2-jwt';
import {GlobalsService} from './globals.service';

@Injectable()

export class ConsultantsService {

  public consultant_list: Consultant[] = [];
  private ApiUrl: string;

  constructor(private _http: Http, private _globalsService: GlobalsService, public authHttp: AuthHttp) {
    this.ApiUrl = this._globalsService.ApiUrl;
  }

  getItems(page: number): Observable<any> {
    let gridState = {
      sort: {
        predicate: [
          {
            predicate: "consultants.name",
            reverse: false
          }
        ]
      }
    }
    return this.authHttp.post(this.ApiUrl + '/consultants/list', {page : page, gridState: gridState}).map(response => response.json());
  }


  getItemsFilteredBy(attributes: any, page: number): Observable<any> {
    return this.authHttp.post(this.ApiUrl + '/consultants/list', {
      gridState: attributes,
      page: page
    }).map(response => response.json());
  }

  getItem(index: number): Observable<any> {
    return this.authHttp.get(this.ApiUrl + '/consultants/' + index).map(response => response.json());
  }

  getIndexOfItem(item: Consultant) {
    return this.consultant_list.indexOf(item);
  }

  insertItem(data: Consultant): Observable<any> {
    return this.authHttp.post(this.ApiUrl + '/consultants', data).map(response => response.json());
  }

  deleteItem(index: number): Observable<any> {
    return this.authHttp.delete(this.ApiUrl + '/consultants/' + index);
  }

  updateItem(data: Consultant): Observable<any> {
    return this.authHttp.put(this.ApiUrl + '/consultants/' + data.id, data).map(response => response.json());
  }

/*  getUsedConsultant(id_consultant?: number) {
    const token = localStorage.getItem('token') !== null ? '&token=' + localStorage.getItem('token') : '';
    return this._http.get('ajax/consultants.php?search=true&used=true&id_consultant=' + id_consultant + token)
        .map(response => response.json());
  }*/
}
