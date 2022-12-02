import ICache from '../../src/cache/i-cache';

export default <T>(): ICache<T> & ICacheMock<T> => {
  return new CacheMock<T>();
}

export interface ICacheMock<T> {
  reset(): void;
  
  wasPutCalled(): boolean;
  wasGetCalled(): boolean;

  setGetResponse(value: T): void;
}

class CacheMock<T> implements ICache<T>, ICacheMock<T> {

  putWasCalled: boolean = false;
  getWasCalled: boolean = false;
  getResponse: T | undefined = undefined;

  // ICache
  put(value: T, expireAt: Date): void {
    this.putWasCalled = true;
  }

  get(now: Date): T | undefined {
    this.getWasCalled = true;
    return this.getResponse;
  }

  // ICacheMock
  reset(): void {
    this.putWasCalled = false;
    this.getWasCalled = false;
  }

  setGetResponse(value: T): void {
    this.getResponse = value;
  }

  wasGetCalled(): boolean {
    return this.getWasCalled;
  }

  wasPutCalled(): boolean {
    return this.putWasCalled;
  }
  
};