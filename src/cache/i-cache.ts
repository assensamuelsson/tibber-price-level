export default interface ICache<T> {
  put(value: T, expireAt: Date): void;
  get(now: Date): T | undefined;
};
