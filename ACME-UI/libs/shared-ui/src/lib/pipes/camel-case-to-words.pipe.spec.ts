import { CamelCaseToWordsPipe } from './camel-case-to-words.pipe';

describe('CamelCaseToWordsPipe', () => {
  it('create an instance', () => {
    const pipe = new CamelCaseToWordsPipe();
    expect(pipe).toBeTruthy();
  });
});
