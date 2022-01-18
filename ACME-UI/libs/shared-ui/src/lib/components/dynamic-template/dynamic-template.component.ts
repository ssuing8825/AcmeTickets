import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { DynamicTemplateHostDirective } from '../../directives/dynamic-template-host.directive';
import { DynamicTemplateConfig, IDynamicComponent } from '../../typings/dynamic-template';

import { IDynamicComponentOutputAction } from './dynamic-component-output-action.interface';

@Component({
  selector: 'global-lib-dynamic-template',
  templateUrl: './dynamic-template.component.html',
  styleUrls: ['./dynamic-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicTemplateComponent implements OnInit {
  @Input() dynamicTemplateConfig!: DynamicTemplateConfig;

  @Output() public componentActionEvent = new EventEmitter<IDynamicComponentOutputAction>();

  @ViewChild(DynamicTemplateHostDirective, { static: true }) EventellectDynamicTemplateHost!: DynamicTemplateHostDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    if (this.dynamicTemplateConfig.component) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.dynamicTemplateConfig.component);

      const viewContainerRef = this.EventellectDynamicTemplateHost.viewContainerRef;
      viewContainerRef.clear();

      const componentRef = viewContainerRef.createComponent<IDynamicComponent>(componentFactory);
      componentRef.instance.data = this.dynamicTemplateConfig.data;
      componentRef.instance.componentActionEvent = this.componentActionEvent;
    }
  }
}
