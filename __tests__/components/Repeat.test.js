import Xpressive, { Task } from '../../src';
import Repeat from '../../src/components/Repeat';

describe('Repeat', () => {
    it('should repeat one times if no param passed', () => {
        const result = {
            answer: 42,
        };

        class ErrorTask extends Task {
            constructor(...args) {
                super(...args);

                this.alreadyRejected = false;
            }

            do() {
                if (this.alreadyRejected) {
                    return Promise.resolve(result);
                }

                this.alreadyRejected = true;
                return Promise.reject('failed');
            }
        }

        const errorTask = <ErrorTask />;

        const spy = jest.spyOn(errorTask, 'start');

        const task = (
            <Repeat>
                {errorTask}
            </Repeat>
        );

        task.start().then(r => {
            expect(r).toEqual(result);
            expect(spy).toHaveBeenCalledTimes(2);
        });
    });

    it('should repeat x times', () => {
        class ErrorTask extends Task {
            do() {
                return Promise.reject('failed');
            }
        }

        const errorTask = <ErrorTask />;

        const spy = jest.spyOn(errorTask, 'start');

        const task = (
            <Repeat times={3}>
                {errorTask}
            </Repeat>
        );

        task.start().catch(() => expect(spy).toHaveBeenCalledTimes(4));
    });
});
