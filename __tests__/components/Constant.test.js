import XTask from '../../src';
import Constant from '../../src/components/Constant';

describe('Merge', () => {
    it('should throw an error if name property missed', () => {
        expect.hasAssertions();

        const task = () => <Constant value={42} />;

        expect(task).toThrowError('Missed name in Constant task');
    });

    it('should throw an error if invalid name property passed', () => {
        expect.hasAssertions();

        const task = () => <Constant name={[]} value={42} />;

        expect(task).toThrowError('Wrong type of name in Constant task. Use string or number');
    });

    it('should throw an error if Constant contains children', () => {
        expect.hasAssertions();

        const task = () => (
            <Constant name="userId" value={42}>
                <Constant name="shouldThrow" value="error" />
            </Constant>
        );

        expect(task).toThrowError('Constant task should not contain children');
    });

    it('should resolve the same value with associated name', () => {
        expect.hasAssertions();

        const task = <Constant name="userId" value={42} />;

        expect(task.start()).resolves.toEqual({
            userId: 42,
        });
    });
});
