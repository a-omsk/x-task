// @flow

import Task from '../Task';

class Repeat extends Task {
    repeatCounter:number;

    constructor(...args:Array<any>) {
        super(...args);

        this.repeatCounter = this.params.times || 1;
    }

    start():Promise<any> {
        return super
            .start()
            .catch(error => {
                if (this.repeatCounter === 0) {
                    return Promise.reject(error);
                }

                this.repeatCounter = this.repeatCounter - 1;

                return this.start();
            });
    }
}

export default Repeat;
