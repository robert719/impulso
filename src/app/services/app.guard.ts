import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";

@Injectable()
export class AppGuard implements CanActivate {
    constructor(private _authService: AuthService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        return this._authService.isAuthenticated();
    }
}