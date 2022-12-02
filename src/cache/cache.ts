import ICache from "./i-cache";

export default class Cache<T> implements ICache<T> {
  value: T | undefined
  expireAt: Date | undefined

  constructor() {
    this.value = undefined;
    this.expireAt = undefined;
  }

  put(value: T, expireAt: Date): void {
    this.value = value;
    this.expireAt = expireAt;
  }

  get(now: Date): T | undefined {
    if (this.expireAt === undefined) return undefined;
    return now < this.expireAt ? this.value : undefined;
  }
};