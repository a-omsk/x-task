import XTask, { Task } from '../../src';
import Get from '../../src/components/Get';

describe('Get', () => {
    let SomeTask;

    beforeAll(() => {
        SomeTask = class SomeTaskClass extends Task {
            do() {
                return Promise.resolve({
                    some: {
                        result: 42,
                        array: [0, 0, 42],
                    },
                });
            }
        };
    });

    it('should throw an error if no path presented', () => {
        expect.hasAssertions();

        expect(() => <Get />).toThrowError('Missed path property in Get task');
    });

    it('should throw an error if path not string or Array', () => {
        expect.hasAssertions();

        expect(() => <Get path={{ hello: 'world' }} />).toThrowError('Get\'s task "path" param must be a string or Array');
    });

    it('should throw an error if "as" param is not a string', () => {
        expect.hasAssertions();

        expect(() => <Get path={'some.task'} as={[]} />).toThrowError('Get\'s task "as" param must be a string');
    });

    it('should throw an error if "path" is empty', () => {
        expect.assertions(2);
        const errorMsg = 'Get\'s task "path" param must not be empty';

        expect(() => <Get path={[]} />).toThrowError(errorMsg);

        expect(() => <Get path="" />).toThrowError(errorMsg);
    });

    it('should throw an error if "as" is empty', () => {
        expect.assertions(1);

        expect(() => <Get path="some.task" as="" />).toThrowError('Get\'s task "as" param must not be empty');
    });

    it('should assign target value with own key', () => {
        expect.hasAssertions();

        const task = (
            <Get path="some.target">
                <SomeTask />
            </Get>
        );

        expect(task.start()).resolves.toHaveProperty('target');
    });

    it('should assign target value with "as" key is presented', () => {
        expect.hasAssertions();

        const task = (
            <Get path="some.target" as="differentName">
                <SomeTask />
            </Get>
        );

        expect(task.start()).resolves.toHaveProperty('differentName');
    });

    it('should return undefined if no value presented by target path', () => {
        expect.hasAssertions();

        const task = (
            <Get path="some.path">
                <SomeTask />
            </Get>
        );

        expect(task.start()).resolves.toEqual({
            path: undefined,
        });
    });

    it('should return target value by given path', () => {
        expect.assertions(2);

        const task = (
            <Get path="some.result" as="itworks">
                <SomeTask />
            </Get>
        );

        expect(task.start()).resolves.toEqual({
            itworks: 42,
        });

        const anotherTask = (
            <Get path="some.array[2]" as="itworks">
                <SomeTask />
            </Get>
        );

        expect(anotherTask.start()).resolves.toEqual({
            itworks: 42,
        });
    });
});
