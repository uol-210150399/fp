import configuration from './configuration';

describe('configuration', () => {
  it('should return the correct configuration', () => {
    expect(configuration()).toEqual({});
  });
});
