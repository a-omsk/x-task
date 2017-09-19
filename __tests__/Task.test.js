import XTask, { Task } from '../src';

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
        expect.hasAssertions();

        const task = (
            <GetWorld>
                <GetHello />
            </GetWorld>
        );

        expect(task.start()).resolves.toEqual('hello world');
    });

    it('should correctly process a nested children', () => {
        expect.hasAssertions();

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
        expect.hasAssertions();

        const task = (
            <GetWorld>
                {() => <GetHello />}
            </GetWorld>
        );

        expect(task.start()).resolves.toEqual('hello world');
    });

    it('should correctly process an error tasks', () => {
        expect.assertions(2);

        class ErrorTask extends Task {
            do() {
                return Promise.reject('error');
            }
        }

        const task = (
            <GetHello>
                <ErrorTask />
            </GetHello>
        );

        expect(task.start()).rejects.toEqual('error');

        class AnotherErrorTask extends Task {
            do() {
                throw new Error('error');
            }
        }

        const anotherTask = (
            <GetHello>
                <AnotherErrorTask />
            </GetHello>
        );

        expect(anotherTask.start()).rejects.toBeInstanceOf(Error);
    });

    it('should throw error if multiple children not wrapped by <Merge />', () => {
        expect.hasAssertions();

        const task = (
            <GetHello>
                <GetWorld />
                <GetSmth />
            </GetHello>
        );

        expect(task.start()).rejects.toEqual('Cannot process multiple children directly. Use Merge Task');
    });

    it('should respect higher-order tasks', () => {
        expect.hasAssertions();

        function withGetWorld(WrappedTask) {
            return class WithGetWorld extends Task {
                do() {
                    return (
                        <GetWorld>
                            <WrappedTask />
                        </GetWorld>
                    );
                }
            };
        }

        const WrappedGetHello = withGetWorld(GetHello);

        const task = <WrappedGetHello />;

        expect(task.start()).resolves.toEqual('hello world');
    });

    it('should remove ownParams from result', () => {
        expect.hasAssertions();

        class WithOwnProps extends Task {
            static get ownParams() {
                return ['some', 'params'];
            }
        }

        const task = (
            <WithOwnProps some params within >
                <GetHello />
            </WithOwnProps>
        );

        expect(task.start()).resolves.toEqual({
            hello: 'hello',
            within: true,
        });
    });
});
