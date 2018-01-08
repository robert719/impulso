import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from './services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  providers: [AuthService]
})
export class AppComponent implements OnInit {
  constructor(translate: TranslateService, private _authService: AuthService,  private _router: Router) {
    translate.addLangs(['en', 'es']);
    translate.setDefaultLang('es');

    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|es/) ? browserLang : 'es');

  }

  ngOnInit(): any {
    this._authService.getLoggedOutEvent().subscribe(() =>
        {
          localStorage.removeItem('token');
          this._router.navigate(['/session/signin']);
        }
        );

  }
}
