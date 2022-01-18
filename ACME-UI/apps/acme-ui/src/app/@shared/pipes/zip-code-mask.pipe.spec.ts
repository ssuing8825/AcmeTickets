import { ZipCodeMaskPipe } from './zip-code-mask.pipe';

describe('ZipCodeMaskPipe', () => {
  it('create an instance', () => {
    const pipe = new ZipCodeMaskPipe();
    expect(pipe).toBeTruthy();
  });
});
