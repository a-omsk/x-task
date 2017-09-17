import XTask, { Task } from '../../src';
import Pick from '../../src/components/Pick';

describe('Pick', () => {
    let GetUser;

    beforeAll(() => {
        GetUser = class GetUserTask extends Task {
            do() {
                return Promise.resolve({
                    id: 123,
                    firstName: 'joe',
                    lastName: 'hill',
                    address: 'some address',
                });
            }
        };
    });

    it('should correctly pick necessary result keys', () => {
        expect.hasAssertions();

        const task = (
            <Pick id firstName>
                <GetUser />
            </Pick>
        );

        expect(task.start()).resolves.toEqual({
            id: 123,
            firstName: 'joe',
        });
    });

    it('should correctly pick and rename necessary result keys ', () => {
        expect.hasAssertions();

        const task = (
            <Pick id="userId" firstName="userName">
                <GetUser />
            </Pick>
        );

        expect(task.start()).resolves.toEqual({
            userId: 123,
            userName: 'joe',
        });
    });

    it('should filter non-string param keys', () => {
        expect.hasAssertions();

        const task = (
            <Pick id={21212} firstName={[]} address={false}>
                <GetUser />
            </Pick>
        );

        expect(task.start()).resolves.toEqual({});
    });
});
