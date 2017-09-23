'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var omit = _interopDefault(require('lodash/omit'));

class Task {

    static get ownParams() {
        return [];
    }

    constructor(params, children) {
        // $FlowIssue: https://github.com/facebook/flow/issues/1152
        if (new.target === Task) {
            throw new TypeError('Cannot construct Task instances directly');
        }

        this.params = params || {};
        this.children = children;
    }

    do() {
        return Promise.resolve(omit(this.params, this.constructor.ownParams));
    }

    onResolve(result) {
        this.setParams(result);

        return this.do();
    }

    setParams(result = {}) {
        Object.assign(this.params, result);
    }

    processDoResults(job) {
        if (job instanceof Task) {
            return job.start();
        }

        if (job instanceof Promise) {
            return job;
        }

        return Promise.resolve(job);
    }

    resolveChild(task) {
        if (task instanceof Task) {
            return task;
        }

        if (task instanceof Function) {
            return this.resolveChild(task());
        }

        throw new Error('invalid child'); // TODO: extend error text
    }

    start() {
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

        return this.resolveChild(this.children[0]).start().then(result => this.onResolve(result));
    }
}

const partition = (array, predicate) => {
    return array.reduce((result, key) => {
        if (predicate(key)) {
            result[0].push(key);
        } else {
            result[1].push(key);
        }

        return result;
    }, [[], []]);
};

class Pick extends Task {
    setParams(result = {}) {
        const paramKeys = Object.keys(this.params).filter(key => (this.params[key] === true || typeof this.params[key] === 'string') && result.hasOwnProperty(key));

        const [sameNameKeys, diffNameKeys] = partition(paramKeys, key => this.params[key] === true);

        const sameNameResult = sameNameKeys.reduce((acc, key) => {
            acc[key] = result[key];

            return acc;
        }, {});

        this.params = diffNameKeys.reduce((acc, key) => {
            acc[this.params[key]] = result[key];

            return acc;
        }, sameNameResult);
    }
}

class Repeat extends Task {

    constructor(...args) {
        super(...args);

        this.repeatCounter = this.params.times || 1;
    }

    start() {
        return super.start().catch(error => {
            if (this.repeatCounter === 0) {
                return Promise.reject(error);
            }

            this.repeatCounter = this.repeatCounter - 1;

            return this.start();
        });
    }
}

class Merge extends Task {

    static get ownParams() {
        return ['onResolve'];
    }

    constructor(...args) {
        super(...args);

        this.merge = this.params.onResolve;
    }

    start() {
        if (this.children.length === 0) {
            return Promise.reject('No children contains in Merge task');
        }

        if (this.params.onResolve instanceof Function === false) {
            return Promise.reject('Missed onResolve function in Merge task');
        }

        const taskPromises = this.children.map(child => this.resolveChild(child).start());

        return Promise.all(taskPromises).then(result => this.merge(result)).then(result => this.onResolve(result));
    }
}

class Merge$2 extends Task {
    do() {
        const { name, value } = this.params;

        return Promise.resolve({ [name]: value });
    }

    start() {
        const { name } = this.params;

        if (!name) {
            return Promise.reject('Missed name in Constant task');
        }

        if (typeof name !== 'string' && typeof name !== 'number') {
            return Promise.reject('Wrong type of name in Constant task. Use string or number');
        }

        if (this.children.length > 0) {
            return Promise.reject('Constant task should not contain children');
        }

        return this.do();
    }
}

class Either extends Task {

    constructor(...args) {
        super(...args);

        this.condition = this.params.condition;
    }

    do() {
        const result = this.condition.call(this);

        if (result) {
            return this.children[1].start();
        }

        return this.children[0].start();
    }

    start() {
        if (typeof this.condition !== 'function') {
            return Promise.reject('Missed condition or invalid condition type in Either task');
        }

        if (this.children.length !== 2) {
            return Promise.reject('Invalid children count in Either task');
        }

        return this.do();
    }
}

class Pipe extends Task {
    start() {
        if (this.children.length === 0) {
            return Promise.reject('No children contains in Pipe task');
        }

        return this.children.reduce((promise, task) => {
            return promise.then(result => {
                const resolvedTask = this.resolveChild(task);

                resolvedTask.setParams(result);

                return resolvedTask.start();
            });
        }, Promise.resolve(Object.assign({}, this.params)));
    }
}

class Take extends Task {

    do() {
        const { from, count } = this.params;

        return Promise.resolve({
            [from]: this.params[from].slice(0, count)
        });
    }

    onResolve(result) {
        if (!result.hasOwnProperty(this.params.from)) {
            return Promise.reject(`No ${this.params.from} key found in result of Take children`);
        }

        if (!Array.isArray(result[this.params.from])) {
            return Promise.reject(`${this.params.from} is not an Array in Take children`);
        }

        return super.onResolve(result);
    }

    start() {
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

class Reject extends Task {

    do() {
        const { error } = this.params;

        if (typeof error === 'string') {
            return Promise.reject(error);
        }

        const errorInstance = new error(); // eslint-disable-line new-cap

        return Promise.reject(errorInstance);
    }

    start() {
        const { error } = this.params;

        if (error === undefined) {
            return Promise.reject('no error presented in Reject task');
        }

        const isErrorConstructor = typeof error === 'function' && error.prototype instanceof Error;

        if (typeof error !== 'string' && !isErrorConstructor) {
            return Promise.reject('Reject\'s task "error" param must be a string or Error / subclass of Error');
        }

        if (this.children.length > 0) {
            return Promise.reject('Reject task should not have any children');
        }

        return this.do();
    }
}

class Zip extends Task {

    do() {
        const { of, as, zipper } = this.params;
        const targetArrays = of.map(key => this.params[key]);

        const smallestArrayLength = targetArrays.reduce((value, array) => Math.min(value, array.length), Infinity);

        const result = [];

        for (let i = 0; i < smallestArrayLength; i++) {
            const currentValues = targetArrays.map(arr => arr[i]);

            result.push(zipper(...currentValues));
        }

        return Promise.resolve({
            [as]: result
        });
    }

    onResolve(result) {
        let missedKey;

        const hasMissedKeys = this.params.of.some(key => {
            const isMissed = !result.hasOwnProperty(key);

            if (isMissed) {
                missedKey = key;
            }

            return isMissed;
        });

        if (hasMissedKeys && missedKey) {
            return Promise.reject(`no "${missedKey}" key presented in results of Zip task`);
        }

        let wrongTypeKey;

        const hasWrongTypeKey = this.params.of.some(key => {
            const isWrongType = !Array.isArray(result[key]);

            if (isWrongType) {
                wrongTypeKey = key;
            }

            return isWrongType;
        });

        if (hasWrongTypeKey && wrongTypeKey) {
            return Promise.reject(`"${wrongTypeKey}" key processed by Zip task is not an Array`);
        }

        return super.onResolve(result);
    }

    start() {
        const { of, as, zipper } = this.params;

        if (typeof of === 'undefined') {
            return Promise.reject('no "of" param presented in Zip task');
        }

        if (!Array.isArray(of)) {
            return Promise.reject('"of" param of Zip task is not Array');
        }

        if (of.length < 2) {
            return Promise.reject('"of" param of Zip task is has insufficient length');
        }

        if (of.some(key => typeof key !== 'string' && typeof key !== 'number')) {
            return Promise.reject('"of" param\' element presented in Zip task should be a number or string');
        }

        if (typeof as === 'undefined') {
            return Promise.reject('no "as" param presented in Zip task');
        }

        if (typeof as !== 'string' && typeof as !== 'number') {
            return Promise.reject('"as" param presented in Zip task should be a number or string');
        }

        if (typeof zipper === 'undefined') {
            return Promise.reject('no "zipper" key presented in Zip task');
        }

        if (typeof zipper !== 'function') {
            return Promise.reject('"zipper" param presented in Zip task should be a function');
        }

        const taskPromises = this.children.map(child => this.resolveChild(child).start());

        return Promise.all(taskPromises).then(result => Object.assign({}, ...result)).then(result => this.onResolve(result));
    }
}

const identity = x => x;

const _get = (object, path) => {
    return path.reduce((value, key) => {
        return typeof value !== 'undefined' ? value[key] : undefined;
    }, object);
};

class Get extends Task {

    do() {
        const { path, as } = this.params;

        const _path = Array.isArray(path) ? path : path.split(/\.|\[|\]/g).filter(identity);
        const result = _get(this.params, _path);
        const targetPath = as || _path[_path.length - 1];

        return Promise.resolve({
            [targetPath]: result
        });
    }

    start() {
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

class Catch extends Task {

    static get ownParams() {
        return ['handler'];
    }

    start() {
        if (typeof this.params.handler === 'undefined') {
            return Promise.reject('no "handler" function contains in Catch task');
        }

        if (typeof this.params.handler !== 'function') {
            return Promise.reject('"handler" param presented in Catch task should be a function');
        }

        return super.start().catch(this.params.handler);
    }
}

var babelHelpers = {};




var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();



















































babelHelpers;

// @jsx XTask.createTask

const _contextKey = Symbol('context');

class Context extends Task {

    static get ownParams() {
        return ['of'];
    }

    constructor(...args) {
        super(...args);

        if (typeof this.params.of === 'undefined') {
            throw new Error('no "of" param presented in Context task');
        }

        if (this.children.length === 0) {
            throw new Error('Context task not contains any children');
        }

        this.setContext(this.children);
    }

    setContext(children) {
        children.map(child => this.resolveChild(child)).forEach(child => {
            if (child.constructor.name === 'WithContext') {
                // $FlowIssue: https://github.com/facebook/flow/issues/3258
                child.setParams({
                    [_contextKey]: this.params.of
                });
            }

            this.setContext(child.children);
        });
    }
}

var index = {
    Pick,
    Repeat,
    Merge,
    Constant: Merge$2,
    Either,
    Pipe,
    Take,
    Reject,
    Zip,
    Get,
    Catch,
    Context
};

module.exports = index;
