const Xpressive = require('../src');
const { Task } = require('../src');

describe('Task', () => {
    it('should works', () => {
        class GetHello extends Task {
            do() {
                return Promise.resolve({ hello: 'hello' });
            }
        }

        class GetWorld extends Task {
            do() {
                return Promise.resolve(this.params.hello + ' world');
            }
        }

        const task = (
            <GetHello>
                <GetWorld />
            </GetHello>
        );

        expect.assertions(1);
        expect(task.start()).resolves.toEqual('hello world');
    });
});
