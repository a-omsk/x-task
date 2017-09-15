// @flow

import Task from '../Task';

type TakeParams = {
    from:string | number,
    count:number;
}

class Take extends Task {
    params:TakeParams;

    do():Promise<any> {
        const { from, count } = this.params;

        return Promise.resolve({
            [from]: this.params[from].slice(0, count),
        });
    }

    onResolve(result:any):Promise<any> {
        if (!result.hasOwnProperty(this.params.from)) {
            return Promise.reject(`No ${this.params.from} key found in result of Take children`);
        }

        if (!Array.isArray(result[this.params.from])) {
            return Promise.reject(`${this.params.from} is not an Array in Take children`);
        }

        return super.onResolve(result);
    }

    start():Promise<any> {
        if (typeof this.params.from !== 'string' && typeof this.params.from !== 'number') {
            return Promise.reject('Invalid type of "from" passed to Take task. Use string or number');
        }

        if (typeof this.params.count !== 'number') {
            return Promise.reject('Invalid type of "count" passed to Take task');
        }

        if (this.children.length === 0) {
            return Promise.reject('No children contains in Take task');
        }

        return super.start();
    }
}

export default Take;
