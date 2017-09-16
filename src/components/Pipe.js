// @flow

import Task from '../Task';

class Pipe extends Task {
    start():Promise<any> {
        if (this.children.length === 0) {
            return Promise.reject('No children contains in Pipe task');
        }

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
