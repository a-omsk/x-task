// @flow

import Task, { TaskError } from '../Task';

type RejectParams = {
    error: string | () => Error
}

class Reject extends Task {
    params:RejectParams;

    constructor(...args:Array<any>) {
        super(...args);

        const { error } = this.params;

        if (error === undefined) {
            throw new TaskError('no error presented in Reject task');
        }

        const isErrorConstructor = typeof error === 'function' && error.prototype instanceof Error;

        if (typeof error !== 'string' && !isErrorConstructor) {
            throw new TaskError('Reject\'s task "error" param must be a string or Error / subclass of Error');
        }

        if (this.children.length > 0) {
            throw new TaskError('Reject task should not have any children');
        }
    }

    do():Promise<any> {
        const { error } = this.params;

        if (typeof error === 'string') {
            return Promise.reject(error);
        }

        const errorInstance = new error(); // eslint-disable-line new-cap

        return Promise.reject(errorInstance);
    }
}

export default Reject;
