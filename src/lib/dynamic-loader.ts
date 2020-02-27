
// https://stackoverflow.com/questions/950087/how-do-i-include-a-javascript-file-in-another-javascript-file

/**
 * 动态加载 script 
 *
 * @export
 * @param {string} url - js url 地址
 * @param {()=>void} callback - 加载完成后执行的回调函数
 */
export function loadScript(url: string) {
    return new Promise(function (resolve, reject) {
        // Adding the script tag to the head as suggested before
        var head = document.head;
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        // @ts-ignore
        script.onreadystatechange = resolve;
        script.onload = resolve;
        script.onerror = reject;

        // Fire the loading
        head.appendChild(script);
    })
}


export interface IScriptConfig {
    name: string;
    path: string;
    deps?: string | string[]; // 依赖哪些项
}
export interface IScriptsLoadResult {
    [key: string]: boolean;
}
export interface ILoaderConfig {
    baseUrl?: string;
    lastLoadResult?: IScriptsLoadResult;
}

export const loadScripts = async (
    scripts: IScriptConfig[],
    config: ILoaderConfig = {}
) => {
    const { baseUrl = '', lastLoadResult } = config;
    return await Promise.all(
        scripts.map(async (script: IScriptConfig) => {
            const { name, path, deps } = script;

            const successResult = { [name]: true };
            const errorResult = { [name]: false };

            // 如果页面中已存在该对象，则不需要请求了
            if ((<any>window)[name]) {
                return successResult;
            } else {
                // 在根据依赖项决定是否请求
                let shouldLoad = true;
                if (!!deps && !!lastLoadResult) {
                    [].concat(deps).forEach((deps: string) => {
                        // 如果不是明确为 false 的话，就可以请求
                        if (lastLoadResult[deps] !== false) {
                            shouldLoad = true;
                        }
                    });
                }

                if (shouldLoad) {
                    return await loadScript(baseUrl + path)
                        .then(() => {
                            return successResult;
                        })
                        .catch(() => {
                            return errorResult;
                        });
                } else {
                    return errorResult;
                }
            }
        })
    );
};


// 按照优先级进行脚本加载
export const dynamicLoadScripts = (scriptsQueue: IScriptConfig[][], config: ILoaderConfig = {}) => () => {
    const array = [].concat(scriptsQueue);
    return {
        next: () => {
            if (array.length) {
                const currentScripts = array.shift();
                return loadScripts(currentScripts, config).then((results: IScriptsLoadResult[]) => {
                    return {
                        value: results,
                        done: false
                    };
                });
            } else {
                return Promise.resolve({
                    done: true
                });
            }
        }
    };
};


export const createScriptsLoadIterator = (scriptsQueue: IScriptConfig[][], config: ILoaderConfig = {}) => {
    return {
        [Symbol.asyncIterator]: dynamicLoadScripts(scriptsQueue, config)
    };
};


export const loadScriptsQueue = async (scriptsQueue: IScriptConfig[][], config: ILoaderConfig = {}) => {
    // @ts-ignore
    for await (const item of createScriptsLoadIterator(scriptsQueue, config)) {
        config.lastLoadResult = config.lastLoadResult || {};
        console.log('current: ', item);
        item.forEach((curResult: IScriptsLoadResult) => {
            config.lastLoadResult = {
                ...config.lastLoadResult,
                ...curResult
            };
        });
    }
    // 返回加载集合
    return config.lastLoadResult;
}
