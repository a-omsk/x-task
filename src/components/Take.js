// @flow

import Task, { TaskError } from '../Task';
import type { TaskArgs } from '../Task';

type TakeParams = {
    from:string | number,
    count:number;
}

class Take extends Task {
    params:TakeParams;

    constructor(...args:TaskArgs) {
        super(...args);

        const { from, count } = this.params;

        if (typeof from !== 'string' && typeof from !== 'number') {
            throw new TaskError('Invalid type of "from" passed to Take task. Use string or number');
        }

        if (typeof count !== 'number') {
            throw new TaskError('Invalid type of "count" passed to Take task');
        }

        if (this.children.length === 0) {
            throw new TaskError('No children contains in Take task');
        }
    }

    do():Promise<any> {
        const { from, count } = this.params;

        return Promise.resolve({
            [from]: this.params[from].slice(0, count),
        });
    }

    onResolve(result:any):Promise<any> | Task {
        if (!result.hasOwnProperty(this.params.from)) {
            return Promise.reject(`No ${this.params.from} key found in result of Take children`);
        }

        if (!Array.isArray(result[this.params.from])) {
            return Promise.reject(`${this.params.from} is not an Array in Take children`);
        }

        return super.onResolve(result);
    }
}

export default Take;
