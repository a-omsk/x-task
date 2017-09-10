// @flow

import Task from '../Task';

class Merge extends Task {
    do():Promise<any> {
        const { name, value } = this.params;

        return Promise.resolve({ [name]: value });
    }

    start():Promise<any> {
        const { name } = this.params;

        if (!name) {
            return Promise.reject('Missed name in Constant task');
        }

        if (typeof name !== 'string' && typeof name !== 'number') {
            return Promise.reject('Wrong type of name in Constant task. Use string or number');
        }

        if (this.children.length > 0) {
            return Promise.reject('Constant task should not contain children');
        }

        return this.do();
    }
}

export default Merge;
