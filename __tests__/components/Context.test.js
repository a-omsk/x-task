import XTask, { Task } from '../../src';
import Context, { withContext, _contextKey } from '../../src/components/Context';

describe('Context', () => {
    let ChildTask;
    let ctx;

    beforeAll(() => {
        ChildTask = class ChildTaskClass extends Task {
            do() {
                return Promise.resolve({
                    ctx: this.params.getContext(),
                });
            }
        };

        ctx = {
            hello: 'world',
        };
    });

    it('should throw an error if no context object presented', () => {
        expect.hasAssertions();

        expect(() => <Context />).toThrowError('no "of" param presented in Context task');
    });

    it('should throw an error if no children presented', () => {
        expect.hasAssertions();

        expect(() => <Context of={ctx} />).toThrowError('Context task not contains any children');
    });

    it('should set context to params of wrapped by withContext HOC child task', () => {
        expect.assertions(2);

        const WrappedChild = withContext(ChildTask);
        const child = <WrappedChild />;

        const spy = jest.spyOn(child, 'setParams');

        const task = (
            <Context of={ctx}>
                {child}
            </Context>
        );

        task.start().then(() => {
            expect(spy).toBeCalled();
            expect(spy.mock.calls[0][0][_contextKey]).toEqual(ctx);

            spy.mockReset();
            spy.mockRestore();
        });
    });

    it('should set correctly resolve results through HOC', () => {
        expect.assertions(1);

        const WrappedChild = withContext(ChildTask);

        const task = (
            <Context of={ctx}>
                <WrappedChild />
            </Context>
        );

        expect(task.start()).resolves.toEqual({
            ctx,
        });
    });

    it('should set correctly resolve results through nested hoc', () => {
        expect.assertions(1);

        class ProxyTask extends Task {}

        const WrappedChild = withContext(ChildTask);

        const task = (
            <Context of={ctx}>
                <ProxyTask>
                    <WrappedChild />
                </ProxyTask>
            </Context>
        );

        expect(task.start()).resolves.toEqual({
            ctx,
        });
    });

    xit('should set correctly resolve results through hoc with children', () => {
        // TODO: withContext wrapped tasks not working with children

        class ProxyTask extends Task {
            do() {
                const context = this.params.getContext();

                return Promise.resolve(Object.assign({
                    world: this.params.childResult,
                }, context));
            }
        }

        class NestedChildTask extends Task {
            do() {
                return Promise.resolve({
                    childResult: 'hello',
                });
            }
        }

        const WrappedChild = withContext(ProxyTask);

        const task = (
            <Context of={ctx}>
                <WrappedChild>
                    <NestedChildTask />
                </WrappedChild>
            </Context>
        );

        expect(task.start()).resolves.toEqual({
            hello: 'world',
            world: 'hello',
        });
    });
});
