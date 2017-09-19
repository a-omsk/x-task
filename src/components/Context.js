// @flow
// @jsx XTask.createTask

import XTask from '../index';
import Task from '../Task';

const _contextKey = Symbol('context');

type ContextParams = {
    of: Object
}

class Context extends Task {
    params:ContextParams;

    static get ownParams():Array<string> {
        return ['of'];
    }

    constructor(...args:Array<any>) {
        super(...args);

        if (typeof this.params.of === 'undefined') {
            throw new Error('no "of" param presented in Context task');
        }

        if (this.children.length === 0) {
            throw new Error('Context task not contains any children');
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

        do():Task {
            return (
                <WrappedComponent
                    {...this.params}
                    getContext={this.getContext.bind(this)}
                />
            );
        }
    };
};

export {
    withContext,
    _contextKey, // for testing purposes only
};

export default Context;
