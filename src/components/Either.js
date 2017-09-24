// @flow

import Task, { TaskError } from '../Task';
import type { TaskArgs } from '../Task';

type PredicateFn = (...args:Array<any>) => boolean;

type EitherParams = {
    predicate: PredicateFn
};

class Either extends Task {
    params:EitherParams;

    static get ownParams() {
        return ['predicate'];
    }

    constructor(...args:TaskArgs) {
        super(...args);

        const { predicate } = this.params;

        if (typeof predicate !== 'function') {
            throw new TaskError('Missed predicate or invalid predicate type in Either task');
        }

        if (this.children.length !== 2) {
            throw new TaskError('Invalid children count in Either task');
        }
    }

    do():Promise<any> {
        const result = this.params.predicate.call(this);

        if (result) {
            return this.children[1].start();
        }

        return this.children[0].start();
    }

    start():Promise<any> {
        return this.do();
    }
}

export default Either;
