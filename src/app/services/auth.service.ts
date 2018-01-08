import {Injectable, EventEmitter} from "@angular/core";
import {Http, Headers} from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs/Observable";
import {User} from "./user";
import {GlobalsService} from "./globals.service";
import {AuthHttp} from 'angular2-jwt';

@Injectable()

export class AuthService {
    private _userLoggedOut = new EventEmitter<any>();
    private ApiUrl: string;

    constructor(private _http: Http, private _globalsService: GlobalsService, public authHttp: AuthHttp) {
        this.ApiUrl = this._globalsService.ApiUrl;
    }

    signIn(user: User): Observable<any> {
        const body = JSON.stringify(user);
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        return this._http.post(this.ApiUrl + '/users/token', body, {headers: headers})
            .map(response => response.json());
    }

    logOut() {
        localStorage.clear();
        this._userLoggedOut.emit(null);
    }

    getCompany(): Observable<any> {
        return this.authHttp.get(this.ApiUrl + '/companies').map(response => response.json());
    }

    getCompanyDetail(index: number) {
        return this.authHttp.get(this.ApiUrl + '/companies/' + index).map(response => response.json());
    }

    changePassword(currentPassword: string, newPassword: string) {
        let data = {
            "currentPasswort": currentPassword,
            "newPassword": newPassword
        }

        return this.authHttp.put(this.ApiUrl + '/users/password', data).map(response => response.json());
    }


    getMlsDetails(id: number, id_holder: number): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '?token=' + localStorage.getItem('token') : '';
        return this._http.get('ajax/authentication.php' + token + '&id=' + id + '&id_holder=' + id_holder)
            .map(response => response.json());
    }

    getLoggedOutEvent(): EventEmitter<any> {
        return this._userLoggedOut;
    }

    isAuthenticated(): boolean {
        return localStorage.getItem('token') !== null;
    }
}
