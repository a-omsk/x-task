import Xpressive, { Task } from '../src';

describe('Task', () => {
    let GetHello;
    let GetWorld;
    let GetSmth;

    beforeEach(() => {
        GetHello = class GetHelloTask extends Task {
            do() {
                return Promise.resolve({ hello: 'hello' });
            }
        };

        GetWorld = class GetWorldTask extends Task {
            do() {
                return Promise.resolve(this.params.hello + ' world');
            }
        };

        GetSmth = class GetSmthTask extends Task {
            do() {
                return Promise.resolve(this.params.hello + ' smth');
            }
        };
    });

    it('should correctly process a single children', () => {
        const task = (
            <GetHello>
                <GetWorld />
            </GetHello>
        );

        expect(task.start()).resolves.toEqual('hello world');
    });

    it('should correctly process a multiple children', () => {
        const task = (
            <GetHello>
                <GetWorld />
                <GetSmth />
            </GetHello>
        );

        expect(task.start()).resolves.toEqual(['hello world', 'hello smth']);
    });
});
