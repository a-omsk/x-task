// @flow

class Task {
    params:Object;
    children: Array<Task>;

    constructor(params:Object, children:Array<Task>) {
        // $FlowIssue: https://github.com/facebook/flow/issues/1152
        if (new.target === Task) {
            throw new TypeError('Cannot construct Task instances directly');
        }

        this.params = params || {};
        this.children = children;
    }

    do():Promise<any> {
        return Promise.resolve(this.params);
    }

    processResults(result:any):Promise<any> {
        this.setParams(result);

        return this.do();
    }

    setParams(result:Object = {}):void {
        Object.assign(this.params, result);
    }

    start():Promise<any> {
        if (!this.children.length) {
            const job = this.do();

            if (job instanceof Task) {
                return job.start();
            }

            if (job instanceof Promise) {
                return job;
            }

            return Promise.resolve(job);
        }

        return this.children[0].start().then(result => this.processResults(result));
    }
}

export default Task;
