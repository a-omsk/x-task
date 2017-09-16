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

    it('should throw an error if no condition passed or wrong type of condition', () => {
        const task = <Either />;

        expect(task.start()).rejects.toEqual('Missed condition or invalid condition type in Either task');
    });

    it('should throw an error if children count is invalid', () => {
        const task = <Either condition={() => true} />;

        expect(task.start()).rejects.toEqual('Invalid children count in Either task');
    });

    it('should choose the Left (first) children when falsy condition result', () => {
        const task = (
            <Either condition={() => false}>
                <Left />
                <Right />
            </Either>
        );

        expect(task.start()).resolves.toEqual({ result: 'left' });
    });

    it('should choose the Right (second) children when truthy condition result', () => {
        const task = (
            <Either condition={() => true}>
                <Left />
                <Right />
            </Either>
        );

        expect(task.start()).resolves.toEqual({ result: 'right' });
    });
});
