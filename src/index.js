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

    start() {
        return this.do().then((result) => {
            if (!this.children) {
                return result;
            }

            Object.assign(this.children.params, result);

            return this.children.start();
        });
    }
}

class Xpressive {
    static createTask(Constructor, params, children) {
        return new Constructor(params, children);
    }
}

Xpressive.Task = Task;

module.exports = Xpressive;
