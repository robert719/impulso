import {Location} from "./location";
import "rxjs/Rx";
import {Http, Headers, RequestOptions} from "@angular/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {GlobalsService} from "./globals.service";
import { AuthHttp } from 'angular2-jwt';


@Injectable()
export class LocationsService {

  public location_list: Location[] = [];
  private ApiUrl: string;

  constructor(private _http: Http, private _globalsService: GlobalsService, public authHttp: AuthHttp) {
    this.ApiUrl = this._globalsService.ApiUrl;
  }

/*  getAllItems(): Observable<any> {
    const token = localStorage.getItem('token') !== null ? '?token=' + localStorage.getItem('token') : '';
    return this._http.get('ajax/locations.php' + token)
        .map(response => response.json());
  }*/

  getItems(page: number): Observable<any> {
    return this.authHttp.post(this.ApiUrl + '/locations/list', {page: page}).map(response => response.json());
  }

  getItemsFilteredBy(attributes: any): Observable<any> {
    return this.authHttp.post(this.ApiUrl + '/locations/list', {
      gridState: attributes
    }).map(response => response.json());
  }

  getItem(index: number): Observable<any> {
    const token = localStorage.getItem('token') !== null ? '&token=' + localStorage.getItem('token') : '';
    return this._http.get('ajax/locations.php?index=' + index + token)
        .map(response => response.json());
  }

  getIndexOfItem(item: Location) {
    return this.location_list.indexOf(item);
  }

  insertItem(item: Location): Observable<any> {
    const token = localStorage.getItem('token') !== null ? '?token=' + localStorage.getItem('token') : '';
    const body = JSON.stringify(item);
    const headers = new Headers();
    headers.append("Content-Location", "application/json");
    return this._http.post('ajax/locations.php' + token, body, { headers: headers })
        .map(response => response.json());
  }

  insertItems(item: Location[]) {

  }

  deleteItem(index: number) {
    const token = localStorage.getItem('token') !== null ? '&token=' + localStorage.getItem('token') : '';
    return this._http.delete('ajax/locations.php?id=' + index + token)
        .map(response => response.json());
  }

  updateItem(item: Location): Observable<any> {
    const token = localStorage.getItem('token') !== null ? '?token=' + localStorage.getItem('token') : '';
    const body = JSON.stringify(item);
    const headers = new Headers();
    headers.append("Content-Location", "application/json");
    return this._http.put('ajax/locations.php' + token, body, { headers: headers })
        .map(response => response.json());
  }
}
