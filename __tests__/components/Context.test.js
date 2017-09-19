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
});
