import XTask, { Task } from '../../src';
import Reject from '../../src/components/Reject';

describe('Reject', () => {
    it('should throw an error if no "error" field presented', () => {
        expect.hasAssertions();

        const task = <Reject />;

        expect(task.start()).rejects.toEqual('no error presented in Reject task');
    });

    it('should throw an error if wrong type of "error" field presented', () => {
        expect.hasAssertions();

        const task = <Reject error={[1, 2, 3]} />;

        expect(task.start()).rejects.toEqual('Reject\'s task "error" param must be a string or Error / subclass of Error');
    });

    it('should throw an error if task have any children', () => {
        expect.hasAssertions();

        class SomeTask extends Task {}

        const task = (
            <Reject error="hello">
                <SomeTask />
            </Reject>
        );

        expect(task.start()).rejects.toEqual('Reject task should not have any children');
    });

    it('should rejects with given error string', () => {
        expect.hasAssertions();

        const error = 'given error';
        const task = <Reject error={error} />;

        expect(task.start()).rejects.toEqual(error);
    });

    it('should rejects with instance of given error constructor', () => {
        expect.hasAssertions();

        class TestError extends Error {}

        const task = <Reject error={TestError} />;

        expect(task.start()).rejects.toBeInstanceOf(TestError);
    });
});
