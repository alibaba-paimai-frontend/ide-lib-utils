export * from 'advance-json-merge';
export * from 'ts-debounce-throttle';
export * from 'aa-loader';
import mitt from 'mitt';

export * from './lib/debug';
export * from './lib/util';

export { mitt };

// 定义版本号
declare const __VERSION__: string;
export const VERSION_LibUtils = __VERSION__;
