/* 常用类型定义 */

export interface IObject<T> {
  [key: string]: T;
}

export interface IPlainObject {
  [key: string]: any;
}
