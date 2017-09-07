import Xpressive, { Task } from '../../src';
import Take from '../../src/components/Take';

describe('Take', () => {
    let GetUser;

    beforeEach(() => {
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

    it('should correctly take necessary result keys', () => {
        const task = (
            <Take id firstName>
                <GetUser />
            </Take>
        );

        expect(task.start()).resolves.toEqual({
            id: 123,
            firstName: 'joe',
        });
    });

    it('should correctly take and rename necessary result keys ', () => {
        const task = (
            <Take id="userId" firstName="userName">
                <GetUser />
            </Take>
        );

        expect(task.start()).resolves.toEqual({
            userId: 123,
            userName: 'joe',
        });
    });

    it('should filter non-string param keys', () => {
        const task = (
            <Take id={21212} firstName={[]} address={false}>
                <GetUser />
            </Take>
        );

        expect(task.start()).resolves.toEqual({});
    });
});
