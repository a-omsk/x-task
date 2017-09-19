// @flow

import Task from '../Task';

type MergeFn = (results:Array<any>) => {[key:string]: any}

class Merge extends Task {
    merge:MergeFn;

    static get ownParams():Array<string> {
        return ['onResolve'];
    }

    constructor(...args:Array<any>) {
        super(...args);

        this.merge = this.params.onResolve;
    }

    start():Promise<any> {
        if (this.children.length === 0) {
            return Promise.reject('No children contains in Merge task');
        }

        if (this.params.onResolve instanceof Function === false) {
            return Promise.reject('Missed onResolve function in Merge task');
        }

        const taskPromises = this.children.map(child => this.resolveChild(child).start());

        return Promise.all(taskPromises)
            .then(result => this.merge(result))
            .then(result => this.onResolve(result));
    }
}

export default Merge;
