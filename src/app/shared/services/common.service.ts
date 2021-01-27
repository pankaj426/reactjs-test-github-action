import { Injectable, Directive, ElementRef, HostListener } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AbstractControl, ValidatorFn, FormGroup } from "@angular/forms";

import * as $ from "node_modules/jquery";
@Injectable({
  providedIn: "root"
})
export class CommonService {
  constructor(private modalService: NgbModal) { }
  public convertToSlug(Text) {
    return Text
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')
      ;
  }
  public getFlags(flagName) {
    if (flagName) {
      let imageToFatch = this.convertToSlug(flagName);
      return imageToFatch + ".png";
    } else {
      return "";
    }

  }
  public chkValidFileExt(file: File): boolean {
    let _validFileExtensions = [
      "docm",
      "dotm",
      "dotx",
      "odt",
      "rtf",
      "txt",
      "csv",
      "xls",
      "xlsb",
      "xlsx",
      "mp3",
      "jpg",
      "jpeg",
      "bmp",
      "gif",
      "png",
      "ppt",
      "pptx",
      "rtf",
      "pdf",
      "wmv",
      "doc",
      "docx",
      "mp4",
      "avi",
      "flv",
      "txt",
      "mov"
    ];
    let doc_name = file.name;
    let fileExt = doc_name;
    let ext = fileExt.split(".").pop().toLocaleLowerCase();
    return _validFileExtensions.includes(ext);
  }


  public chkValidImageFileExt(file: File): boolean {
    let _validFileExtensions = [
      "jpg",
      "jpeg",
      "bmp",
      // "gif",
      "png"
    ];
    let doc_name = file.name;
    let fileExt = doc_name;
    let ext = fileExt.split(".").pop();
    return _validFileExtensions.includes(ext);
  }
  public chkValidDocumentFileExt(file: File): boolean {
    let _validFileExtensions = [
      "pdf",
      "pptx",
      "docx"
      
    ];
    let doc_name = file.name;
    let fileExt = doc_name;
    let ext = fileExt.split(".").pop();
    return _validFileExtensions.includes(ext);
  }
  public isValidResourceFile(file: File): boolean {
    let _validFileExtensions = [
      "jpg",
      "jpeg",
      "bmp",
      "gif",
      "png",
      "pdf",
      "mp3",
      "wmv",
      "mp4",
      "avi",
      "flv",
      "mov",
      "webm",
      "mkv",
      "vob",
      "ogg",
      "ogv",
      "m4p",
      "m4v",
      "mpg",
      "mp2",
      "mpeg",
      "mpe",
      "3gp",
      "3g2"
    ];
    let doc_name = file.name;
    let fileExt = doc_name;
    let ext = fileExt.split(".").pop().toLocaleLowerCase();
    return _validFileExtensions.includes(ext);
  }
  public isVideoFile(file: File): boolean {
    let _validFileExtensions = [
      "mp3",
      "wmv",
      "mp4",
      "avi",
      "flv",
      "mov",
      "webm",
      "mkv",
      "vob",
      "ogg",
      "ogv",
      "m4p",
      "m4v",
      "mpg",
      "mp2",
      "mpeg",
      "mpe",
      "3gp",
      "3g2"
    ];
    let doc_name = file.name;
    let fileExt = doc_name;
    let ext = fileExt.split(".").pop();
    return _validFileExtensions.includes(ext);
  }
  public openPopup(componentName, title) {
    const modalRef = this.modalService.open(componentName, {
      backdrop: "static",
      keyboard: false,
      windowClass: "custom-modal"
    });
    modalRef.componentInstance.title = title;
  }
  public markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      // if (control.controls) {
      //     control.controls.forEach(c => this.markFormGroupTouched(c));
      // }
    });
  }
  public openSuccessPopup(componentName, title) {
    const modalRef = this.modalService.open(componentName, {
      backdrop: "static",
      keyboard: false,
      windowClass: "custom-modal cibil-request-success-modal"
    });
    modalRef.componentInstance.title = title;
  }
  removeFixHeaderFromInnerPages() {
    $(".header-wrap").removeClass("fix");
  }
  combineAddress(data: any) {
    let address = "";
    if (data != null) {
      address =
        data.door_no != null && data.door_no != "" && data.door_no != "null"
          ? data.door_no
          : "";
      if (address != "") {
        address =
          address +
          (data.floor_no != null &&
            data.floor_no != "" &&
            data.floor_no != "null"
            ? ", " + data.floor_no
            : "");
      } else {
        address =
          data.floor_no != null &&
            data.floor_no != "" &&
            data.floor_no != "null"
            ? data.floor_no
            : "";
      }

      if (address != "") {
        address =
          address +
          (data.building_name != null &&
            data.building_name != "" &&
            data.building_name != "null"
            ? ", " + data.building_name
            : "");
      } else {
        address =
          data.building_name != null &&
            data.building_name != "" &&
            data.building_name != "null"
            ? data.building_name
            : "";
      }

      if (address != "") {
        address =
          address +
          (data.street != null && data.street != "" && data.street != "null"
            ? ", " + data.street
            : "");
      } else {
        address =
          data.street != null && data.street != "" && data.street != "null"
            ? data.street
            : "";
      }

      if (address != "") {
        address =
          address +
          (data.location != null &&
            data.location != "" &&
            data.location != "null"
            ? ", " + data.location
            : "");
      } else {
        address =
          data.location != null &&
            data.location != "" &&
            data.location != "null"
            ? data.location
            : "";
      }

      if (address != "") {
        address =
          address +
          (data.landmark != null &&
            data.landmark != "" &&
            data.landmark != "null"
            ? ", " + data.landmark
            : "");
      } else {
        address =
          data.landmark != null &&
            data.landmark != "" &&
            data.landmark != "null"
            ? data.landmark
            : "";
      }

      if (address != "") {
        address =
          address +
          (data.city_name != null &&
            data.city_name != "" &&
            data.city_name != "null"
            ? ", " + data.city_name
            : "");
      } else {
        address =
          data.city_name != null &&
            data.city_name != "" &&
            data.city_name != "null"
            ? data.city_name
            : "";
      }

      if (address != "") {
        address =
          address +
          (data.district != null &&
            data.district != "" &&
            data.district != "null"
            ? ", " + data.district
            : "");
      } else {
        address =
          data.district != null &&
            data.district != "" &&
            data.district != "null"
            ? data.district
            : "";
      }

      if (address != "") {
        address =
          address +
          (data.state_name != null &&
            data.state_name != "" &&
            data.state_name != "null"
            ? ", " + data.state_name
            : "");
      } else {
        address =
          data.state_name != null &&
            data.state_name != "" &&
            data.state_name != "null"
            ? data.state_name
            : "";
      }

      if (address != "") {
        address =
          address +
          (data.pin_code != null &&
            data.pin_code != "" &&
            data.pin_code != "null"
            ? " - " + data.pin_code
            : "");
      } else {
        address =
          data.pin_code != null &&
            data.pin_code != "" &&
            data.pin_code != "null"
            ? data.pin_code
            : "";
      }
    }
    return address;
  }

  public closePopup() {
    this.modalService.dismissAll();
  }
  public hideBreaCrumMenuOnResponsive() {
    /*$(".jq_main_menu").click(function () {
            $(this).toggleClass("mobile-inner-header-icon-click mobile-inner-header-icon-out");
            $(".main-menu").toggleClass("active");
            $(".jq_overlay").toggleClass("active");
            $("body").toggleClass("body-overflow");
        });*/
  }
  public smoothScroll() {
    if (window.pageYOffset > 30) {
      let i = 100;
      const int = setInterval(function () {
        window.scrollTo(0, i);
        i -= 10;
        if (i === 0) {
          window.scrollTo(0, 0);
          clearInterval(int);
        }
      }, 30);
    }
    $(".custom-dropdown-menu").removeClass("open");
  }

  onKeyValidateDecimal(): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      let number = /^[.\d]+$/.test(c.value) ? +c.value : NaN;
      if (number !== number) {
        return { value: true };
      }

      return null;
    };
  }

  keyPressNumber(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  _keyPressString(event: any) {
    const pattern = /^[a-zA-Z]*$/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  public openAddnewmemberPopup(componentName, title) {
    const modalRef = this.modalService.open(componentName, {
      backdrop: "static",
      keyboard: false,
      windowClass: "custom-modal register-new-mmember-modal"
    });
    modalRef.componentInstance.title = title;
  }
  public openPopupSendInvitation(componentName, title) {
    const modalRef = this.modalService.open(componentName, {
      backdrop: "static",
      keyboard: false,
      windowClass: "custom-modal invite-more-user-modal"
    });
    modalRef.componentInstance.title = title;
  }
  public openProRegistrationSuccessPopup(componentName, title) {
    const modalRef = this.modalService.open(componentName, {
      backdrop: "static",
      keyboard: false,
      windowClass: "custom-modal pro-registration-success-modal"
    });
    modalRef.componentInstance.title = title;
  }
}
