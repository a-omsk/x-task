// @flow

import Task, { TaskError } from '../Task';
import type { TaskArgs } from '../Task';

type TimeoutParams = {
    limit: number
};

class Timeout extends Task {
    params:TimeoutParams;

    static get ownParams() {
        return ['limit'];
    }

    constructor(...args:TaskArgs) {
        super(...args);

        const { limit } = this.params;

        if (typeof limit === 'undefined') {
            throw new TaskError('No "limit" presented in Timeout task');
        }

        if (typeof limit !== 'number') {
            throw new TaskError('Timeout\'s task "limit" param must be a number');
        }

        if (this.children.length === 0) {
            throw new TaskError('Timeout task not contains any children');
        }
    }

    do():Promise<any> {
        const child = this.resolveChild(this.children[0]);

        return new Promise((_, reject) => {
            setTimeout(() => {
                reject(`Timeout reached for ${child.constructor.name} task`);
            }, this.params.limit);
        });
    }

    start():Promise<any> {
        return Promise.race([
            this.resolveChild(this.children[0]).start(),
            this.do(),
        ]);
    }
}

export default Timeout;
