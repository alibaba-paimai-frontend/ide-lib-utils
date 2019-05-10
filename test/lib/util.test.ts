import { pick, omit } from '../../src';
import Chance from 'chance';

const chance = new Chance();

describe('[pick] 从对象中获取指定属性', () => {
  test('空对象', () => {
    const schema = {};
    expect(pick(schema, [chance.word()])).toEqual({});
  });

  test('获取指定元素', () => {
    const schema = {
      a: 1,
      b: 2
    };
    expect(pick(schema, ['a'])).toEqual({ a: 1 });
    expect(pick(schema, ['a', 'a'])).toEqual({ a: 1 });
    expect(pick(schema, ['b'])).toEqual({ b: 2 });
    expect(pick(schema, ['b', 'b'])).toEqual({ b: 2 });
    expect(pick(schema, ['b', 'a'])).toEqual({ a: 1, b: 2 });
    expect(pick(schema, ['a', 'b'])).toEqual({ a: 1, b: 2 });
  });
});

describe('[omit] 从对象中排除指定属性', () => {
  test('空对象', () => {
    const schema = {};
    expect(omit(schema, [chance.word()])).toEqual({});
  });

  test('剔除指定元素', () => {
    const schema = {
      a: 1,
      b: 2
    };
    expect(omit(schema, 'a')).toEqual({ b: 2 });
    expect(omit(schema, ['a', 'a'])).toEqual({ b: 2 });
    expect(omit(schema, 'b')).toEqual({ a: 1 });
    expect(omit(schema, ['b', 'b'])).toEqual({ a: 1 });
    expect(omit(schema, ['b', 'a'])).toEqual({});
    expect(omit(schema, ['a', 'b'])).toEqual({});
  });

  test('支持函数方式保留满足条件的元素', () => {
    const schema = {
      a: 1,
      b: 2
    };
    expect(
      omit(schema, function(val, key) {
        return key === 'a';
      })
    ).toEqual({ a: 1 });
    expect(
      omit(schema, function(val, key) {
        return val === 1;
      })
    ).toEqual({ a: 1 });
  });
});
