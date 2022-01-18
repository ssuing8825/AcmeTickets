import { RouteWithIdPipe } from './route-with-id.pipe';

describe('RouteWithIdPipe', () => {
  it('create an instance', () => {
    const pipe = new RouteWithIdPipe();
    expect(pipe).toBeTruthy();
  });
});
