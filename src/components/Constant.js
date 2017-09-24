// @flow

import Task, { TaskError } from '../Task';
import type { TaskArgs } from '../Task';

class Merge extends Task {
    constructor(...args:TaskArgs) {
        super(...args);

        const { name } = this.params;

        if (!name) {
            throw new TaskError('Missed name in Constant task');
        }

        if (typeof name !== 'string' && typeof name !== 'number') {
            throw new TaskError('Wrong type of name in Constant task. Use string or number');
        }

        if (this.children.length > 0) {
            throw new TaskError('Constant task should not contain children');
        }
    }

    do():Promise<any> {
        const { name, value } = this.params;

        return Promise.resolve({ [name]: value });
    }
}

export default Merge;
