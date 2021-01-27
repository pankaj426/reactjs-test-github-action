import { DOCUMENT } from '@angular/common';
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
  HostListener
} from '@angular/core';
import { ROUTES } from './sidebar-items';
import {ActivatedRoute} from "@angular/router"
import { Router, NavigationEnd } from "@angular/router";
import {environment} from "../../../environments/environment";
import{ RouterService} from "../../shared/services/router.service"
const admin=environment.admin;
const adminBasePath=admin.basePath;
const corpBasePath="/"+admin.corporates.basePath;
const startupsBasePath="/"+admin.startups.basePath;
const corporatePath="/"+adminBasePath+corpBasePath
const startupsPath="/"+adminBasePath+startupsBasePath;
const corpAppPath=corporatePath+"/"+admin.corporates.applications;
const startupAppPath=startupsPath+admin.startups.applications;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent implements OnInit {
  public sidebarItems: any[];
  showMenu = '';
  showSubMenu = '';
  public innerHeight: any;
  public bodyTag: any;
  listMaxHeight: string;
  listMaxWidth: string;
  headerHeight = 60;
  currentBasePath:any="";
  currentPath:any="";
  public dashboard = ''
  public startups = ''
  public promotions = ''
  public corporates = ''
  @HostListener('window:resize', ['$event'])
  windowResizecall(event) {
    this.setMenuHeight();
    this.checkStatuForResize(false);
  }
  @HostListener('document:mousedown', ['$event'])

  onGlobalClick(event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.renderer.removeClass(this.document.body, 'overlay-open');
    }
  }
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private routerService:RouterService
  ) {}
  reSetActiveClass(){
    this.dashboard = ''
    this.startups = ''
    this.corporates = ''
  }
  showSelectedMenu() {
    this.reSetActiveClass();
    let curl=window.location.pathname;
     this.addClass(curl);
    this.router.events.subscribe(r => {
      if(r instanceof NavigationEnd){
        this.reSetActiveClass();
        curl=r.url
        this.addClass(curl);
      }
    })
  }
  addClass(path) {
    switch (path) {
      case this.routerService.adminMenu.dashboard:
        this.dashboard = 'active'
        break;
      case this.routerService.adminMenu.corporates:
        this.corporates = 'active'
        break;
      case this.routerService.adminMenu.startups:
        this.startups = 'active'
        break;
      case this.routerService.adminMenu.promotions:
        this.promotions = 'active'
        break;
    }
  }
  reDirectToCorporates(){
    this.routerService.redirectToCorpApplication();
  }
  reDirectToStartups(){
    this.routerService.redirectToStartupApplication();
  }
  reDirectToPromotions() {
    this.routerService.redirectToPromotions();
  }
  

  makeActive(showMenu,title:string=''){
    
    return showMenu ===  title.toLowerCase();
  }
  callMenuToggle(event: any, element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
    const hasClass = event.target.classList.contains('toggled');
    if (hasClass) {
      this.renderer.removeClass(event.target, 'toggled');
    } else {
      this.renderer.addClass(event.target, 'toggled');
    }
    if(element.toLowerCase() == 'corporates'){
      this.routerService.redirectToCorpApplication();
    }else if(element.toLowerCase() == 'startups'){
      this.routerService.redirectToStartupApplication();
    }
  }
  callSubMenuToggle(element: any) {
    if (element === this.showSubMenu) {
      this.showSubMenu = '0';
    } else {
      this.showSubMenu = element;
    }
  }
 
  ngOnInit() {
    //this.sidebarItems = ROUTES.filter(sidebarItem => sidebarItem);
    this.initLeftSidebar();
    this.showSelectedMenu();
    
    this.bodyTag = this.document.body;
  /*   let url_arr=this.router.url.split("/");
    this.currentBasePath=url_arr[2];
    this.currentPath="/"+this.currentBasePath[1]+"/"+this.currentBasePath+"/"+url_arr[3];
    this.showMenu = this.currentBasePath; */
  }
  initLeftSidebar() {
    const _this = this;
    // Set menu height
    _this.setMenuHeight();
    _this.checkStatuForResize(true);
    // Set Waves
    // Waves.attach('.menu .list a', ['waves-block']);
    // Waves.init();
  }
  setMenuHeight() {
    this.innerHeight = window.innerHeight;
    const height = this.innerHeight - this.headerHeight;
    this.listMaxHeight = height + '';
    this.listMaxWidth = '500px';
  }
  isOpen() {
    return this.bodyTag.classList.contains('overlay-open');
  }
  checkStatuForResize(firstTime) {
    if (window.innerWidth < 1170) {
      this.renderer.addClass(this.document.body, 'ls-closed');
    } else {
      this.renderer.removeClass(this.document.body, 'ls-closed');
    }
  }
  mouseHover(e) {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('submenu-closed')) {
      this.renderer.addClass(this.document.body, 'side-closed-hover');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
    }
  }
  mouseOut(e) {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('side-closed-hover')) {
      this.renderer.removeClass(this.document.body, 'side-closed-hover');
      this.renderer.addClass(this.document.body, 'submenu-closed');
    }
  }
}
