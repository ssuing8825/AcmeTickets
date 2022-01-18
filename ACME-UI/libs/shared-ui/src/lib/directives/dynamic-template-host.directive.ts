import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[globalLibDynamicTemplateHost]',
})
export class DynamicTemplateHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
