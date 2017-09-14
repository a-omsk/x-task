// @flow

import Task from '../Task';

class Pipe extends Task {
    start():Promise<any> {
        if (this.children.length === 0) {
            return Promise.reject('No children contains in Pipe task');
        }

        return this.children.reduce((promise:Promise<any>, task:Task) => {
            return promise.then(result => {
                task.setParams(result);

                return task.start();
            });
        }, Promise.resolve(Object.assign({}, this.params)));
    }
}

export default Pipe;
