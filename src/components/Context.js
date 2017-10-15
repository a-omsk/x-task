// @flow

import XTask from '../index';
import Task, { TaskError } from '../Task';
import type { TaskArgs } from '../Task';

const _contextKey = Symbol('context');

type ContextParams = {
    of: Object
}

class Context extends Task {
    params:ContextParams;

    static get ownParams():Array<any> {
        return ['of', _contextKey];
    }

    constructor(...args:TaskArgs) {
        super(...args);

        if (typeof this.params.of === 'undefined') {
            throw new TaskError('no "of" param presented in Context task');
        }

        if (this.children.length === 0) {
            throw new TaskError('Context task not contains any children');
        }

        this.setContext(this.children);
    }

    setContext(children:Array<Task>) {
        children
            .map(child => this.resolveChild(child))
            .forEach(child => {
                if (child.constructor.name === 'WithContext') {
                    // $FlowIssue: https://github.com/facebook/flow/issues/3258
                    child.setParams({
                        [_contextKey]: this.params.of,
                    });
                }

                this.setContext(child.children);
            });
    }
}

const withContext = (WrappedComponent:Function) => {
    return class WithContext extends Task {
        getContext() {
            return this.params[_contextKey];
        }

        start():Promise<any> {
            const task = XTask.createTask(WrappedComponent, Object.assign({
                getContext: this.getContext.bind(this),
            }, this.params), ...this.children);

            return task
                .start()
                .then(r => this.onResolve(r));
        }
    };
};

export {
    withContext,
    _contextKey, // for testing purposes only
};

export default Context;
