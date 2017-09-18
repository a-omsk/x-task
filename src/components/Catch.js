// @flow

import omit from 'lodash/omit';
import Task from '../Task';

type CatchParams = {
    handler: Function
}

class Catch extends Task {
    params:CatchParams;

    do():Promise<any> {
        return Promise.resolve(omit(this.params, 'handler'));
    }

    start():Promise<any> {
        if (typeof this.params.handler === 'undefined') {
            return Promise.reject('no "handler" function contains in Catch task');
        }

        if (typeof this.params.handler !== 'function') {
            return Promise.reject('"handler" param presented in Catch task should be a function');
        }

        return super
            .start()
            .catch(this.params.handler);
    }
}

export default Catch;
