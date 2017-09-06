class Task {
    constructor(params, children) {
        if (new.target === Task) {
            throw new TypeError('Cannot construct Task instances directly');
        }

        this.params = params || {};
        this.children = children;
    }

    do() {
        return Promise.resolve(this.params);
    }

    processDoResults(result) {
        if (!this.children.length) {
            return result;
        }

        this.children.forEach((child) => Object.assign(child.params, result));

        if (this.children.length === 1) {
            return this.children[0].start();
        }

        return Promise.all(this.children.map(child => child.start()));
    }

    start() {
        return this.do().then((...args) => this.processDoResults(...args));
    }
}

class Xpressive {
    static createTask(Constructor, params, ...children) {
        return new Constructor(params, children);
    }
}

Xpressive.Task = Task;

module.exports = Xpressive;
