import { Directive, ElementRef, AfterViewInit } from '@angular/core'

@Directive({
  selector: '[appAutoFocus]',
})
export class AutoFocusDirective implements AfterViewInit {
  constructor(private elementRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    this.elementRef.nativeElement.focus()
  }
}
