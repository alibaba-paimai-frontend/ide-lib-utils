export const Debug = require('debug');

// 基本 log 构造函数
// 添加一些基本的注释，方便理解；
export const debugBaseByName = (name: string) => (type:string, ...notes:string[]) => (...props: string[]) => {
    let str = '';
    [].concat(notes).forEach(note => {
        str += `[${note}]`;
    });

    props[0] = str + props[0];
    Debug(`${name}:${type}`)(...props);
}

export const createDebuggers = (name: string) => {

    const debugBase = debugBaseByName(name);
    const debugMini = debugBase('mini', '普通'); // 普通的日志
    const debugError = debugBase('error', '错误'); // 错误日志

    const debugModel = debugBase('model', '模型'); // 模型的日志
    const debugComp = debugBase('comp', '组件'); // 组件的日志
    const debugRender = debugBase('render', '渲染时');  // render 回调中的日志
    const debugInteract = debugBase('act', '交互行为');  // 交互行为，用户触发的
    const debugIO = debugBase('io', '数据请求');  // io 请求时的日志

    return {
        debugBase,
        debugMini,
        debugError,
        debugModel,
        debugComp,
        debugRender,
        debugInteract,
        debugIO
    }
}
