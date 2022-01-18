import { Injector, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'globalLibDynamic',
})
export class DynamicPipe implements PipeTransform {
  public constructor(private injector: Injector) {}

  transform(value: unknown, pipeToken: unknown, pipeArgs?: unknown[] | undefined, dynamicArg?: unknown | undefined): unknown {
    if (!pipeToken) {
      return value;
    }
    const args = pipeArgs ?? [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pipe = this.injector.get<any>(pipeToken as any);
    return pipe.transform(value, ...args, dynamicArg);
  }
}
