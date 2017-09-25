import XTask, { Task } from '../../src';
import Timeout from '../../src/components/Timeout';

describe('Reject', () => {
    let FastTask;
    let SlowTask;

    beforeAll(() => {
        FastTask = class SomeTaskClass extends Task {
            do() {
                return Promise.resolve({
                    result: 42,
                });
            }
        };

        SlowTask = class SomeTaskClass extends Task {
            do() {
                return new Promise(() => ({}));
            }
        };
    });

    it('should throw an error if no "limit" field presented', () => {
        expect.hasAssertions();

        const task = () => <Timeout />;

        expect(task).toThrowError('No "limit" presented in Timeout task');
    });

    it('should throw an error if wrong type of "limit" field presented', () => {
        expect.hasAssertions();

        const task = () => <Timeout limit="hello" />;

        expect(task).toThrowError('Timeout\'s task "limit" param must be a number');
    });

    it('should throw an error if task have no any children', () => {
        expect.hasAssertions();

        const task = () => <Timeout limit={500} />;

        expect(task).toThrowError('Timeout task not contains any children');
    });

    it('should not reject if task resolved within limit bound', () => {
        expect.hasAssertions();

        jest.useFakeTimers();

        const task = (
            <Timeout limit={100}>
                <FastTask />
            </Timeout>
        );

        task.start().then(result => {
            expect(result).toEqual({
                result: 42,
            });

            jest.clearAllTimers();
        });

        jest.runTimersToTime(100);
    });

    it('should rejects with timeout error if task not resolved within limit bound', () => {
        expect.hasAssertions();

        jest.useFakeTimers();

        const task = (
            <Timeout limit={50}>
                <SlowTask />
            </Timeout>
        );


        expect(task.start()).rejects.toEqual('Timeout reached for SomeTaskClass task');
        jest.runAllTimers();
    });
});
