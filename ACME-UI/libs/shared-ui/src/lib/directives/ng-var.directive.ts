/* eslint-disable @typescript-eslint/no-explicit-any */
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[globalLibNgVar]',
})
export class NgVarDirective {
  context: any = {};
  constructor(private vcRef: ViewContainerRef, private templateRef: TemplateRef<any>) {}
  @Input()
  set ngVar(context: any) {
    this.context.$implicit = this.context.ngVar = context;
    this.updateView();
  }

  updateView() {
    this.vcRef.clear();
    this.vcRef.createEmbeddedView(this.templateRef, this.context);
  }
}

/**
 * Sample Usage:
 * <div *globalLibVar="someCompVar as templateVar">
      <span>{{variable | json}}</span>
    </div>

 */
