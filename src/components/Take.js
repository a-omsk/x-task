// @flow

import partition from 'lodash/partition';
import Task from '../Task';

class Take extends Task {
    setParams(result:Object = {}):void {
        const paramKeys = Object
            .keys(this.params)
            .filter(key => (this.params[key] === true || typeof this.params[key] === 'string') &&
                result.hasOwnProperty(key));

        const [sameNameKeys, diffNameKeys] = partition(paramKeys, key => this.params[key] === true);

        const sameNameResult = sameNameKeys.reduce((acc, key) => {
            acc[key] = result[key];

            return acc;
        }, {});

        this.params = diffNameKeys.reduce((acc, key) => {
            acc[this.params[key]] = result[key];

            return acc;
        }, sameNameResult);
    }
}

export default Take;
