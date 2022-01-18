import { PhoneMaskPipe } from './phone-mask.pipe';

describe('PhoneMaskPipe', () => {
  it('create an instance', () => {
    const pipe = new PhoneMaskPipe();
    expect(pipe).toBeTruthy();
  });
});
