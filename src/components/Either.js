// @flow

import Task from '../Task';

type ConditionFn = () => boolean;

class Either extends Task {
    condition:ConditionFn;

    constructor(...args:Array<any>) {
        super(...args);

        this.condition = this.params.condition;
    }

    do():Promise<any> {
        const result = this.condition.call(this);

        if (result) {
            return this.children[1].start();
        }

        return this.children[0].start();
    }

    start():Promise<any> {
        if (typeof this.condition !== 'function') {
            return Promise.reject('Missed condition or invalid condition type in Either task');
        }

        if (this.children.length !== 2) {
            return Promise.reject('Invalid children count in Either task');
        }

        return this.do();
    }
}

export default Either;
