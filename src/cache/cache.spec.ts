import assert from 'assert';
import { beforeEach, describe, it } from 'node:test';

import ICache from './i-cache';
import Cache from './cache';

describe('Given that cache is empty', () => {

  let cache: ICache<number>
  const before = new Date('2022-01-01T00:00:59Z');
  const now = new Date('2022-01-01T00:01:00Z');
  const after = new Date('2022-01-01T00:01:01Z');

  beforeEach(() => {
    cache = new Cache<number>();
  })

  it('Then it should return undefined when get', () => {
    const actual = cache.get(now);

    assert.equal(actual, undefined);
  });
  
  it(`
    And a value is entered into the cache
    And expireAt is after now
    Then that value should be recieved when get`, () => {
    const value = 1234;
    cache.put(value, after);

    const actual = cache.get(now);

    assert.equal(actual, value);
  });


  it(`
    And two values are put
    And expireAt is after now
    Then the last value should be recieved when get`, () => {
    const first = 1234;
    const last = 4321;

    cache.put(first, after);
    cache.put(last, after);
    const actual = cache.get(now);

    assert.equal(actual, last);
  });

  it(`
    And a value is put with expireAt
    Then it should return undefined when get after expireAt`, () => {
    cache.put(1234, before);

    const actual = cache.get(now);

    assert.equal(actual, undefined);
  });
});
