import isEmpty from 'lodash/isEmpty';
import XTask, { Task } from '../../src';
import Or from '../../src/components/Or';

describe('Pick', () => {
    let EmptyTask;
    let NormalTask;

    beforeAll(() => {
        EmptyTask = class EmptyTaskClass extends Task {
            do() {
                return Promise.resolve();
            }
        };

        NormalTask = class NormalTaskClass extends Task {
            do() {
                return Promise.resolve({
                    result: 42,
                });
            }
        };
    });

    it('should throw an error if predicate is not a function', () => {
        expect(() => <Or predicate={[]} />).toThrowError('predicate of Or task is not a function');
        expect(() => <Or predicate={isEmpty} />).not.toThrowError('predicate of Or task is not a function');
    });

    it('should throw an error if no children presented', () => {
        expect(() => <Or />).toThrowError('Or task not contain any children');
    });

    it('should start the first child and return result if not empty (default predicate)', () => {
        const normalTask = <NormalTask />;
        const emptyTask = <EmptyTask />;

        const spy = jest.spyOn(emptyTask, 'start');

        const task = (
            <Or>
                {normalTask}
                {emptyTask}
            </Or>
        );

        task.start().then(result => {
            expect(result).toEqual({
                result: 42,
            });

            expect(spy).not.toBeCalled();

            spy.mockReset();
            spy.mockRestore();
        });
    });

    it('should start the first child and start next child if result is empty (default predicate)', () => {
        const normalTask = <NormalTask />;
        const emptyTask = <EmptyTask />;

        const normalTaskSpy = jest.spyOn(normalTask, 'start');

        const task = (
            <Or>
                {normalTask}
                {emptyTask}
            </Or>
        );

        task.start().then(result => {
            expect(result).toEqual({
                result: 42,
            });

            expect(normalTaskSpy).toBeCalled();

            normalTaskSpy.mockReset();
            normalTaskSpy.mockRestore();
        });
    });

    it('should start the first child and return result if not empty (custom predicate)', () => {
        const normalTask = <NormalTask />;
        const emptyTask = <EmptyTask />;

        const spy = jest.spyOn(normalTask, 'start');

        const task = (
            <Or predicate={isEmpty}>
                {emptyTask}
                {normalTask}
            </Or>
        );

        task.start().then(result => {
            expect(result).toEqual({});

            expect(spy).not.toBeCalled();

            spy.mockReset();
            spy.mockRestore();
        });
    });

    it('should start the first child and start next child if result is empty (custom predicate)', () => {
        const normalTask = <NormalTask />;
        const emptyTask = <EmptyTask />;

        const normalTaskSpy = jest.spyOn(normalTask, 'start');
        const emptyTaskSpy = jest.spyOn(emptyTask, 'start');

        const task = (
            <Or predicate={isEmpty}>
                {normalTask}
                {emptyTask}
            </Or>
        );

        task.start().then(result => {
            expect(result).toEqual({});

            expect(normalTaskSpy).toBeCalled();
            expect(emptyTaskSpy).toBeCalled();

            normalTaskSpy.mockReset();
            normalTaskSpy.mockRestore();

            emptyTaskSpy.mockReset();
            emptyTaskSpy.mockRestore();
        });
    });
});
