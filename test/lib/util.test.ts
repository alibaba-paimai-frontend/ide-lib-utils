import { pick, omit, advanceMerge } from '../../src';
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

describe('[advanceMerge] 指定条目 merge', () => {
  test('origin 较少的情况', () => {
    const originData = {
      schema: { a: 1, b: 2, d: { c: 4 } },
      visible: 1,
      other: 5
    };

    const targetData = {
      schema: { a: 11, c: 12, d: { e: 14, f: 15 } },
      formData: { c: 13 },
      visible: 4
    };

    // 默认是 Object.assign 功能
    expect(advanceMerge(originData, targetData)).toEqual(
      Object.assign({}, originData, targetData)
    );

    // level 0 默认是 Object.assign 功能
    expect(
      advanceMerge(originData, targetData, {
        schema: { level: 0 },
        formData: { level: 0 }
      })
    ).toEqual(Object.assign({}, originData, targetData));

    // level 1 ，浅层次合并
    expect(
      advanceMerge(originData, targetData, {
        schema: { level: 1 },
        formData: { level: 1 }
      })
    ).toEqual({
      schema: { a: 11, b: 2, c: 12, d: { e: 14, f: 15 } },
      formData: { c: 13 },
      visible: 4,
      other: 5
    });

    // level 2
    expect(
      advanceMerge(originData, targetData, {
        schema: { level: 2 },
        formData: { level: 1 }
      })
    ).toEqual({
      schema: { a: 11, b: 2, c: 12, d: { c: 4, e: 14, f: 15 } },
      formData: { c: 13 },
      visible: 4,
      other: 5
    });
  });

  test.only('propsEditor 2 层融合', () => {
    const originData = {
      propsEditor: {
        formData: { c: 2 }
      }
    };

    const targetData = {
      propsEditor: {
        formData: { a: 1, b: 3 },
        schema: { c: 4 }
      }
    };

    expect(
      advanceMerge(originData, targetData, {
        propsEditor: {
          level: 2
        }
      })
    ).toEqual({
      propsEditor: {
        formData: { a: 1, b: 3, c: 2 },
        schema: { c: 4 }
      }
    });
  });
});
