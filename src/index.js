// @flow

class Task {
    params:Object;
    children: Array<Task>;

    constructor(params, children) {
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

    processDoResults(result):Promise<any> {
        if (!this.children.length) {
            return result;
        }

        this.children.forEach((child) => Object.assign(child.params, result));

        if (this.children.length === 1) {
            return this.children[0].start();
        }

        return Promise.all(this.children.map(child => child.start()));
    }

    start():Promise<any> {
        return this.do().then((...args) => this.processDoResults(...args));
    }
}

class Xpressive {
    static Task:Function;

    static createTask(Constructor:Function, params, ...children:Array<Task>):Task {
        return new Constructor(params, children);
    }
}

Xpressive.Task = Task;

module.exports = Xpressive;
