import { SortByPropertyNamePipe } from './sort-by-property-name.pipe';

describe('SortByPropertyNamePipe', () => {
  it('create an instance', () => {
    const pipe = new SortByPropertyNamePipe();
    expect(pipe).toBeTruthy();
  });
});
