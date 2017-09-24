// @flow

import Task, { TaskError } from '../Task';
import type { TaskArgs } from '../Task';

class Pipe extends Task {
    constructor(...args:TaskArgs) {
        super(...args);

        if (this.children.length === 0) {
            throw new TaskError('No children contains in Pipe task');
        }
    }

    start():Promise<any> {
        return this.children.reduce((promise:Promise<any>, task:Task | Function) => {
            return promise.then(result => {
                const resolvedTask = this.resolveChild(task);

                resolvedTask.setParams(result);

                return resolvedTask.start();
            });
        }, Promise.resolve(Object.assign({}, this.params)));
    }
}

export default Pipe;
