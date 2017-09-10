import Xpressive, { Task } from '../../src';
import Merge from '../../src/components/Merge';

describe('Merge', () => {
    let GetHello;
    let GetThis;
    let GetWorld;

    beforeEach(() => {
        GetHello = class GetHelloTask extends Task {
            do() {
                return Promise.resolve({ result: 'hello' });
            }
        };

        GetThis = class GetThisTask extends Task {
            do() {
                return Promise.resolve({ result: 'this' });
            }
        };

        GetWorld = class GetWorldTask extends Task {
            do() {
                return Promise.resolve({ result: 'world' });
            }
        };
    });

    it('should throw an error if no children contains within', () => {
        const task = <Merge onResolve={() => true} />;

        expect(task.start()).rejects.toEqual('No children contains in Merge task');
    });

    it('should throw an error if missed onResolve function in params', () => {
        const task = (
            <Merge>
                <GetHello />
                <GetThis />
                <GetWorld />
            </Merge>
        );

        expect(task.start()).rejects.toEqual('Missed onResolve function in Merge task');
    });

    it('should correctly merge the children results', () => {
        const onResolve = (results) => ({
            result: results.map(r => r.result).join(' '),
        });

        const task = (
            <Merge onResolve={onResolve}>
                <GetHello />
                <GetThis />
                <GetWorld />
            </Merge>
        );

        expect(task.start()).resolves.toEqual({
            result: 'hello this world',
        });
    });
});
