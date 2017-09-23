// @flow

import omit from 'lodash/omit';

class TaskError extends Error {}

class Task {
    params:Object;
    children: Array<Task | Function>;

    static get ownParams():Array<string> {
        return [];
    }

    constructor(params:Object, children:Array<Task>) {
        // $FlowIssue: https://github.com/facebook/flow/issues/1152
        if (new.target === Task) {
            throw new TypeError('Cannot construct Task instances directly');
        }

        this.params = params || {};
        this.children = children;
    }

    do():Promise<any> | Task {
        return Promise.resolve(omit(this.params, this.constructor.ownParams));
    }

    onResolve(result:any):Promise<any> | Task {
        this.setParams(result);

        return this.do();
    }

    setParams(result:Object = {}):void {
        Object.assign(this.params, result);
    }

    processDoResults(job:any):Promise<any> {
        if (job instanceof Task) {
            return job.start();
        }

        if (job instanceof Promise) {
            return job;
        }

        return Promise.resolve(job);
    }

    resolveChild(task: Task | Function):Task {
        if (task instanceof Task) {
            return task;
        }

        if (task instanceof Function) {
            return this.resolveChild(task());
        }

        throw new Error('invalid child'); // TODO: extend error text
    }

    start():Promise<any> {
        if (this.children.length === 0) {
            try {
                const job = this.do();

                return this.processDoResults(job);
            } catch (e) {
                return Promise.reject(e);
            }
        }

        if (this.children.length > 1) {
            return Promise.reject('Cannot process multiple children directly. Use Merge Task');
        }

        return this.resolveChild(this.children[0])
            .start()
            .then(result => this.onResolve(result));
    }
}

export default Task;

export {
    TaskError,
};
