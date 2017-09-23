import XTask, { Task } from '../../src';
import Either from '../../src/components/Either';

describe('Either', () => {
    let Left;
    let Right;

    beforeAll(() => {
        Left = class LeftTask extends Task {
            do() {
                return Promise.resolve({ result: 'left' });
            }
        };

        Right = class RightLast extends Task {
            do() {
                return Promise.resolve({ result: 'right' });
            }
        };
    });

    it('should throw an error if no predicate passed or wrong type of predicate', () => {
        expect.hasAssertions();

        const task = () => <Either />;

        expect(task).toThrowError('Missed predicate or invalid predicate type in Either task');
    });

    it('should throw an error if children count is invalid', () => {
        expect.hasAssertions();

        const task = () => <Either predicate={() => true} />;

        expect(task).toThrowError('Invalid children count in Either task');
    });

    it('should choose the Left (first) children when falsy predicate result', () => {
        expect.hasAssertions();

        const task = (
            <Either predicate={() => false}>
                <Left />
                <Right />
            </Either>
        );

        expect(task.start()).resolves.toEqual({ result: 'left' });
    });

    it('should choose the Right (second) children when truthy predicate result', () => {
        expect.hasAssertions();

        const task = (
            <Either predicate={() => true}>
                <Left />
                <Right />
            </Either>
        );

        expect(task.start()).resolves.toEqual({ result: 'right' });
    });
});
