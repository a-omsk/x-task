// @flow

import Task, { TaskError } from '../Task';
import type { TaskArgs } from '../Task';

type MergeFn = (results:Array<any>) => {[key:string]: any}

type MergeParams = {
    onResolve: MergeFn
}

class Merge extends Task {
    params:MergeParams;

    static get ownParams():Array<string> {
        return ['onResolve'];
    }

    constructor(...args:TaskArgs) {
        super(...args);

        if (this.children.length === 0) {
            throw new TaskError('No children contains in Merge task');
        }

        if (typeof this.params.onResolve !== 'function') {
            throw new TaskError('Missed onResolve function in Merge task');
        }
    }

    start():Promise<any> {
        const taskPromises = this.children.map(child => this.resolveChild(child).start());

        return Promise.all(taskPromises)
            .then(result => this.params.onResolve(result))
            .then(result => this.onResolve(result));
    }
}

export default Merge;
