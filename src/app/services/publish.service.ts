import {Property} from "./property";
import "rxjs/Rx";
import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Observable} from "rxjs";

import {AuthHttp} from 'angular2-jwt';
import {GlobalsService} from './globals.service';

@Injectable()

export class PublishService {

    private ApiUrl: string;

    constructor(private _http: Http, private _globalsService: GlobalsService, public authHttp: AuthHttp) {
        this.ApiUrl = this._globalsService.ApiUrl;
    }

/*    publishInMls(item: any): Observable<any> {
      const token = localStorage.getItem('token') !== null ? '?token=' + localStorage.getItem('token') : '';
      const body = JSON.stringify(item);
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      return this._http.post('ajax/publish.php' + token, body, { headers: headers })
          .map(response => response.json());
    }*/

    changePublish(data: any): Observable<any> {
        return this.authHttp.post(this.ApiUrl + '/properties/publish/' + data.id, {status: data.status});
    }

/*    deleteFromMls(index: number) {
        const token = localStorage.getItem('token') !== null ? '&token=' + localStorage.getItem('token') : '';
        return this._http.delete('ajax/publish.php?id=' + index + token)
            .map(response => response.json());
    }*/


}
