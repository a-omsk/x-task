// @flow

import Task from '../Task';

const identity = x => x;

const _get = (object:Object, path:Array<string>) => {
    return path.reduce((value, key: string) => {
        return typeof value !== 'undefined' ? value[key] : undefined;
    }, object);
};

type GetParams = {
    path:string | Array<string>,
    as?:string
}

class Get extends Task {
    params:GetParams;

    do():Promise<any> {
        const { path, as } = this.params;

        const _path = Array.isArray(path) ? path : path.split(/\.|\[|\]/g).filter(identity);
        const result = _get(this.params, _path);
        const targetPath = as || _path[_path.length - 1];

        return Promise.resolve({
            [targetPath]: result,
        });
    }

    start():Promise<any> {
        const { path, as } = this.params;

        if (typeof path === 'undefined') {
            return Promise.reject('Missed path property in Get task');
        }

        if (typeof path !== 'string' && !Array.isArray(path)) {
            return Promise.reject('Get\'s task "path" param must be a string or Array');
        }

        if (typeof as !== 'undefined' && typeof as !== 'string') {
            return Promise.reject('Get\'s task "as" param must be a string');
        }

        if (typeof as !== 'undefined' && as.length === 0) {
            return Promise.reject('Get\'s task "as" param must not be empty');
        }

        if (path.length === 0) {
            return Promise.reject('Get\'s task "path" param must not be empty');
        }

        return super.start();
    }
}

export default Get;
