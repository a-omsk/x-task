// @flow

import negate from 'lodash/negate';
import isEmpty from 'lodash/isEmpty';

import Task, { TaskError } from '../Task';

type PredicateFn = (result:Object) => boolean;

type OrParams = {
    predicate?: PredicateFn
}

class Or extends Task {
    params: OrParams;
    predicate:PredicateFn;

    static get ownParams() {
        return ['predicate'];
    }

    constructor(...args:Array<any>) {
        super(...args);

        const { predicate } = this.params;

        if (typeof predicate !== 'undefined' && typeof predicate !== 'function') {
            throw new TaskError('predicate of Or task is not a function');
        }

        if (this.children.length === 0) {
            throw new TaskError('Or task not contain any children');
        }

        this.predicate = predicate || negate(isEmpty);
    }

    start():Promise<any> {
        const [first, ...rest] = this.children;
        const { predicate } = this;

        return rest
            .reduce((promise, child) => promise.then(result => {
                if (predicate(result)) {
                    return result;
                }

                const nextChild = this.resolveChild(child);

                nextChild.setParams(result);

                return nextChild.start();
            }), this.resolveChild(first).start())
            .then(result => this.onResolve(result));
    }
}

export default Or;
