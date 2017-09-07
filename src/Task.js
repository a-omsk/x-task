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

    processDoResults(result:any):Promise<any> {
        if (!this.children.length) {
            return result;
        }

        this.children.forEach(child => child.setParams(result));

        if (this.children.length === 1) {
            return this.children[0].start();
        }

        return Promise.all(this.children.map(child => child.start()));
    }

    setParams(result:Object = {}):void {
        Object.assign(this.params, result);
    }

    start():Promise<any> {
        const deferred = this.do();

        if (deferred instanceof Promise === false) {
            return this.processDoResults(deferred);
        }

        return deferred.then(result => this.processDoResults(result));
    }
}

export default Task;
