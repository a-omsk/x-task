import XTask, { Task } from '../../src';
import Catch from '../../src/components/Catch';

describe('Catch', () => {
    let ProblemTask;
    let handler;

    beforeAll(() => {
        ProblemTask = class ProblemTaskClass extends Task {
            do() {
                return Promise.reject('Oops');
            }
        };

        handler = () => ({ result: 42 });
    });

    it('should throw an error if no handler presented', () => {
        expect.hasAssertions();

        const task = () => <Catch />;

        expect(task).toThrowError('no "handler" function contains in Catch task');
    });

    it('should throw an error if wrong type of handler presented', () => {
        expect.hasAssertions();

        const task = () => <Catch handler={[]} />;

        expect(task).toThrowError('"handler" param presented in Catch task should be a function');
    });

    it('should correctly handle the error', () => {
        expect.assertions(1);

        const task = (
            <Catch handler={handler}>
                <ProblemTask />
            </Catch>
        );

        expect(task.start()).resolves.toEqual({
            result: 42,
        });
    });
});
