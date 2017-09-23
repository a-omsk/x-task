// @flow

import Task, { TaskError } from '../Task';

type CatchParams = {
    handler: Function
}

class Catch extends Task {
    params:CatchParams;

    constructor(...args:Array<any>) {
        super(...args);

        if (typeof this.params.handler === 'undefined') {
            throw new TaskError('no "handler" function contains in Catch task');
        }

        if (typeof this.params.handler !== 'function') {
            throw new TaskError('"handler" param presented in Catch task should be a function');
        }
    }

    static get ownParams():Array<string> {
        return ['handler'];
    }

    start():Promise<any> {
        return super
            .start()
            .catch(this.params.handler);
    }
}

export default Catch;
