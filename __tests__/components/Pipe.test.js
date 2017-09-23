import XTask, { Task } from '../../src';
import Pipe from '../../src/components/Pipe';

describe('Pipe', () => {
    let First;
    let Second;
    let Third;

    beforeAll(() => {
        First = class FirstTask extends Task {
            do() {
                return Promise.resolve({
                    do: '4',
                });
            }
        };

        Second = class SecondTask extends Task {
            do() {
                return Promise.resolve(Object.assign({}, this.params, {
                    some: '2',
                }));
            }
        };

        Third = class ThirdTask extends Task {
            do() {
                return Promise.resolve({
                    result: this.params.do + this.params.some,
                });
            }
        };
    });

    it('should throw an error if no children contains within', () => {
        const task = () => <Pipe />;

        expect(task).toThrowError('No children contains in Pipe task');
    });

    it('should sequentially do the tasks passed as children', () => {
        const task = (
            <Pipe>
                <First />
                <Second />
                <Third />
            </Pipe>
        );

        expect(task.start()).resolves.toEqual({
            result: '42',
        });
    });
});
