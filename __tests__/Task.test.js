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
            <GetWorld>
                <GetHello />
            </GetWorld>
        );

        expect(task.start()).resolves.toEqual('hello world');
    });

    it('should correctly process a nested children', () => {
        const result = {
            answer: 42,
        };

        class First extends Task {
            do() {
                return Promise.resolve(result);
            }
        }

        class Second extends Task {
            do() {
                return <First />;
            }
        }

        class Third extends Task {
            do() {
                return <Second />;
            }
        }

        const task = <Third />;

        expect(task.start()).resolves.toEqual(result);
    });

    it('should correctly process a function children', () => {
        const task = (
            <GetWorld>
                {() => <GetHello />}
            </GetWorld>
        );

        expect(task.start()).resolves.toEqual('hello world');
    });

    it.skip('should correctly process a multiple children', () => {
        const task = (
            <GetHello>
                <GetWorld />
                <GetSmth />
            </GetHello>
        );

        expect(task.start()).resolves.toEqual(['hello world', 'hello smth']);
    });

    it.skip('should respect higher-order tasks', () => {});
});
