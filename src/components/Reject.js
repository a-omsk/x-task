// @flow

import Task from '../Task';

type RejectParams = {
    error: string | () => Error
}

class Reject extends Task {
    params:RejectParams;

    do():Promise<any> {
        const { error } = this.params;

        if (typeof error === 'string') {
            return Promise.reject(error);
        }

        const errorInstance = new error(); // eslint-disable-line new-cap

        return Promise.reject(errorInstance);
    }

    start():Promise<any> {
        const { error } = this.params;

        if (error === undefined) {
            return Promise.reject('no error presented in Reject task');
        }

        const isErrorConstructor = typeof error === 'function' && error.prototype instanceof Error;

        if (typeof error !== 'string' && !isErrorConstructor) {
            return Promise.reject('Reject\'s task "error" param must be a string or Error / subclass of Error');
        }

        if (this.children.length > 0) {
            return Promise.reject('Reject task should not have any children');
        }

        return this.do();
    }
}

export default Reject;
