import { Component, OnInit, OnDestroy, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuItems } from '../../shared/menu-items/menu-items';
import { Subscription } from 'rxjs/Subscription';

import { TranslateService } from '@ngx-translate/core';
import * as Ps from 'perfect-scrollbar';
import {addPropertyService} from '../../services/addProperty.service';
import {AuthService} from "../../services/auth.service";
import {ConfigService} from "../../services/config.service";

@Component({
  selector: 'app-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit, OnDestroy, AfterViewInit {

  private _router: Subscription;

  today: number = Date.now();
  url: string;
  showSettings = false;
  dark: boolean;
  boxed: boolean;
  collapseSidebar: boolean;
  compactSidebar: boolean;
  currentLang = 'es';
  navigationState: string;

  showAddPropertyButton = false;

  addButtonSubscription: any;

  company_name: any;
/*  company_id: any;
  company_email: any;*/
  company_logo: any;

  changeConfigSubscription: any;

  @ViewChild('sidemenu') sidemenu;
  @ViewChild('root') root;

  constructor(
      private router: Router,
      public menuItems: MenuItems,
      public translate: TranslateService,
      private _addPropertyService: addPropertyService,
      private _authService: AuthService,
      private _configService: ConfigService
  ) {
    const browserLang: string = translate.getBrowserLang();
    //translate.use(browserLang.match(/en|es/) ? browserLang : 'es');
    translate.use('es');

    this.addButtonSubscription = this._addPropertyService.getButtonValue()
        .subscribe(
            value => {
              if (value) {
                this.showAddPropertyButton = true;
              }
              else {
                this.showAddPropertyButton = false;
              }
            },
            error => console.log(error)
        );

    this.changeConfigSubscription = this._configService.changeConfigPromise()
        .subscribe(
            value => {
              this.dark = value[0].on;
            },
            error => console.log(error)
        );

    this.company_name = localStorage.getItem('companyName');
    this.company_logo = localStorage.getItem('companyLogo');
  }

  ngOnInit(): void {
    console.log(this.company_logo);
    const elemSidebar = <HTMLElement>document.querySelector('.app-inner > .sidebar-panel');
    const elemContent = <HTMLElement>document.querySelector('.app-inner > .mat-sidenav-content');

    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac() && !this.compactSidebar) {
      Ps.initialize(elemSidebar, { wheelSpeed: 2, suppressScrollX: true });
      Ps.initialize(elemContent, { wheelSpeed: 2, suppressScrollX: true });
    }

    this.url = this.router.url;

    if (this.url === '/home') {
      this.navigationState = 'Inicio';
    } else
    if (this.url === '/properties') {
      this.navigationState = 'Propiedades';
    } else
    if (this.url === '/owners') {
      this.navigationState = 'Propietarios';
    } else
    if (this.url === '/consultants') {
      this.navigationState = 'Asesores';
    } else
    if (this.url === '/locations') {
      this.navigationState = 'Ubicaciones';
    }

    this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {

      document.querySelector('.app-inner .mat-sidenav-content').scrollTop = 0;
      this.url = event.url

      if (this.url === '/home') {
        this.navigationState = 'Inicio';
      } else
      if (this.url === '/properties') {
        this.navigationState = 'Propiedades';
      } else
      if (this.url === '/owners') {
        this.navigationState = 'Propietarios';
      } else
      if (this.url === '/consultants') {
        this.navigationState = 'Asesores';
      } else
      if (this.url === '/locations') {
        this.navigationState = 'Ubicaciones';
      }

      this.runOnRouteChange();

    });


  }

  ngAfterViewInit(): void  {
    this.root.dir = 'ltr';
    this.runOnRouteChange();
  }

  ngOnDestroy(): void  {
    this._router.unsubscribe();
  }

  runOnRouteChange(): void {
    if (this.isOver()) {
      this.sidemenu.close();
    }

    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac() && !this.compactSidebar) {
      const elemContent = <HTMLElement>document.querySelector('.app-inner > .mat-sidenav-content');
      Ps.update(elemContent);
    }
  }

  isOver(): boolean {
    if (this.url === '/apps/messages' ||
      this.url === '/apps/calendar' ||
      this.url === '/apps/media' ||
      this.url === '/maps/leaflet' ||
      this.url === '/taskboard') {
      return true;
    } else {
      return window.matchMedia(`(max-width: 960px)`).matches;
    }
  }

  isMac(): boolean {
    let bool = false;
    if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
      bool = true;
    }
    return bool;
  }

  menuMouseOver(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && this.collapseSidebar) {
      this.sidemenu.mode = 'over';
    }
  }

  menuMouseOut(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && this.collapseSidebar) {
      this.sidemenu.mode = 'side';
    }
  }

/*  updatePS(): void  {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac() && !this.compactSidebar) {
      const elemSidebar = <HTMLElement>document.querySelector('.app-inner > .sidebar-panel');
      setTimeout(() => { Ps.update(elemSidebar) }, 350);
    }
  }*/

/*
  addMenuItem(): void {
    this.menuItems.add({
      state: 'menu',
      name: 'MENU',
      type: 'sub',
      icon: 'trending_flat',
      children: [
        {state: 'menu', name: 'MENU'},
        {state: 'timeline', name: 'MENU'}
      ]
    });
  }*/

  addingProperty() {
    this._addPropertyService.addingProperty(true);
  }

  logOut() {
    this._authService.logOut();
  }
}
