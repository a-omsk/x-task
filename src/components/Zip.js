// @flow

import Task, { TaskError } from '../Task';

type ZipParams = {
    of: Array<string | number>,
    as: string,
    zipper(...args:Array<any>): Array<any>
}

class Zip extends Task {
    params:ZipParams;

    constructor(...args:Array<any>) {
        super(...args);

        const { of, as, zipper } = this.params;

        if (typeof of === 'undefined') {
            throw new TaskError('no "of" param presented in Zip task');
        }

        if (!Array.isArray(of)) {
            throw new TaskError('"of" param of Zip task is not Array');
        }

        if (of.length < 2) {
            throw new TaskError('"of" param of Zip task is has insufficient length');
        }

        if (of.some((key) => typeof key !== 'string' && typeof key !== 'number')) {
            throw new TaskError('"of" param\' element presented in Zip task should be a number or string');
        }

        if (typeof as === 'undefined') {
            throw new TaskError('no "as" param presented in Zip task');
        }

        if (typeof as !== 'string' && typeof as !== 'number') {
            throw new TaskError('"as" param presented in Zip task should be a number or string');
        }

        if (typeof zipper === 'undefined') {
            throw new TaskError('no "zipper" key presented in Zip task');
        }

        if (typeof zipper !== 'function') {
            throw new TaskError('"zipper" param presented in Zip task should be a function');
        }

    }

    do():Promise<any> {
        const { of, as, zipper } = this.params;
        const targetArrays = of
            .map(key => this.params[key]);

        const smallestArrayLength = targetArrays
            .reduce((value, array) => Math.min(value, array.length), Infinity);

        const result = [];

        for (let i = 0; i < smallestArrayLength; i++) {
            const currentValues = targetArrays.map(arr => arr[i]);

            result.push(zipper(...currentValues));
        }

        return Promise.resolve({
            [as]: result,
        });
    }

    onResolve(result:Object):Promise<any> | Task {
        let missedKey;

        const hasMissedKeys = this.params.of.some(key => {
            const isMissed = !result.hasOwnProperty(key);

            if (isMissed) {
                missedKey = key;
            }

            return isMissed;
        });

        if (hasMissedKeys && missedKey) {
            return Promise.reject(`no "${missedKey}" key presented in results of Zip task`);
        }

        let wrongTypeKey;

        const hasWrongTypeKey = this.params.of.some(key => {
            const isWrongType = !Array.isArray(result[key]);

            if (isWrongType) {
                wrongTypeKey = key;
            }

            return isWrongType;
        });

        if (hasWrongTypeKey && wrongTypeKey) {
            return Promise.reject(`"${wrongTypeKey}" key processed by Zip task is not an Array`);
        }

        return super.onResolve(result);
    }

    start():Promise<any> {
        const taskPromises = this.children.map(child => this.resolveChild(child).start());

        return Promise.all(taskPromises)
            .then(result => Object.assign({}, ...result))
            .then(result => this.onResolve(result));
    }
}

export default Zip;
