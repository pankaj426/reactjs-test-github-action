import { Directive, ElementRef, HostListener, Renderer2, NgModule  } from "@angular/core";

@Directive({
  selector: "[appTextCount]"
})
export class TextCountDirective {
  constructor(private _el: ElementRef, private _renderer: Renderer2) {}
  text;
  formGroup: any;
  ngOnInit() {
    this.formGroup = this._el.nativeElement.closest(".input-field");
    //console.log("ashwani")
    //console.log("===>", this.formGroup);
    let divElement = this._renderer.createElement("small");
    let textLenght = this._el.nativeElement.maxLength
    //console.log(this._el.nativeElement.maxLength)
    let text = this._renderer.createText(
      String(this._el.nativeElement.maxLength) + `/` + textLenght
    );
    this._renderer.addClass(divElement, "text-right");
    this._renderer.addClass(divElement, "text-muted");
    this._renderer.addClass(divElement, "show-remaining-count");
    this._renderer.appendChild(divElement, text);
    this._renderer.appendChild(this.formGroup, divElement);
    this.charCount()
  }
  @HostListener("ngModelChange", ["$event"]) onKeyUp(value) {
    this.charCount()
  }
  charCount() {
    let leftChars =
    this._el.nativeElement.maxLength - this._el.nativeElement.value.length;
    let textLenght = this._el.nativeElement.maxLength
    this.formGroup.querySelectorAll("small")[0].innerHTML =
    String(leftChars) + `/` + textLenght;
  }
}

@NgModule({
  declarations: [ TextCountDirective ],
  exports: [ TextCountDirective ]
})

export class RequiredsignDirectiveModule {}
