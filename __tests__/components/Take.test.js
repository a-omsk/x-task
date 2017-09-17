import XTask, { Task } from '../../src';
import Take from '../../src/components/Take';

describe('Take', () => {
    let SomeTask;

    beforeAll(() => {
        SomeTask = class SomeTaskClass extends Task {
            do() {
                return Promise.resolve({
                    someArray: [1, 2, 3, 4, 5],
                    someNumber: 2345,
                });
            }
        };
    });

    it('should throw an error if passed prop is not array', () => {
        expect.assertions(2);

        const errorMsg = 'Invalid type of "from" passed to Take task. Use string or number';
        const task = <Take />;

        expect(task.start()).rejects.toEqual(errorMsg);

        const anotherTask = <Take from={{ hello: 'world' }} />;

        expect(anotherTask.start()).rejects.toEqual(errorMsg);
    });

    it('should throw an error if no count passed or it has invalid type', () => {
        expect.assertions(2);

        const errorMsg = 'Invalid type of "count" passed to Take task';
        const task = <Take from="someArray" />;

        expect(task.start()).rejects.toEqual(errorMsg);

        const anotherTask = <Take from="someArray" count="hello" />;

        expect(anotherTask.start()).rejects.toEqual(errorMsg);
    });

    it('should throw an error if no children contains', () => {
        expect.hasAssertions();

        const task = <Take from="someArray" count={3} />;

        expect(task.start()).rejects.toEqual('No children contains in Take task');
    });

    it('should throw an error if no key passed to "from" not contains in children result', () => {
        expect.hasAssertions();

        const task = (
            <Take from="invalidKey" count={3}>
                <SomeTask />
            </Take>
        );

        expect(task.start()).rejects.toEqual('No invalidKey key found in result of Take children');
    });

    it('should throw an error if no key passed to "from" not contains in children result', () => {
        expect.hasAssertions();

        const task = (
            <Take from="someNumber" count={3}>
                <SomeTask />
            </Take>
        );

        expect(task.start()).rejects.toEqual('someNumber is not an Array in Take children');
    });

    it('should take n (count) elements from target key (from) of children result', () => {
        expect.hasAssertions();

        const task = (
            <Take from="someArray" count={3}>
                <SomeTask />
            </Take>
        );

        expect(task.start()).resolves.toEqual({
            someArray: [1, 2, 3],
        });
    });
});
