import XTask, { Task } from '../../src';
import Zip from '../../src/components/Zip';

describe('Zip', () => {
    let Ids;
    let Users;
    let Friends;

    let zipper;

    beforeAll(() => {
        Ids = class IdsTask extends Task {
            do() {
                return Promise.resolve({
                    ids: [1, 2, 3],
                });
            }
        };

        Users = class UsersTask extends Task {
            do() {
                return Promise.resolve({
                    users: [
                        { name: 'john' },
                        { name: 'sarah' },
                        { name: 'peter' },
                    ],
                });
            }
        };

        Friends = class FriendsTask extends Task {
            do() {
                return Promise.resolve({
                    friends: [
                        [2, 3],
                        [1, 3],
                        [1, 2],
                    ],
                });
            }
        };

        zipper = (id, { name }, friends) => ({
            id,
            name,
            friends,
        });
    });

    it('should throw an error if no "of" param presented', () => {
        const task = () => <Zip />;

        expect(task).toThrowError('no "of" param presented in Zip task');
    });

    it('should throw an error if "of" param is not Array', () => {
        const task = () => <Zip of="users" />;

        expect(task).toThrowError('"of" param of Zip task is not Array');
    });

    it('should throw an error if "of" param length less then 2', () => {
        const task = () => <Zip of={['users']} />;

        expect(task).toThrowError('"of" param of Zip task is has insufficient length');
    });

    it('should throw an error if "of" param\'s elements  has invalid type', () => {
        const task = () => <Zip of={[{}, 'users']} />;

        expect(task).toThrowError('"of" param\' element presented in Zip task should be a number or string');
    });

    it('should throw an error if no "as" param presented', () => {
        const task = () => <Zip of={['ids', 'users']} />;

        expect(task).toThrowError('no "as" param presented in Zip task');
    });

    it('should throw an error if "as" param has invalid type', () => {
        const task = () => <Zip of={['ids', 'users']} as={[]} />;

        expect(task).toThrowError('"as" param presented in Zip task should be a number or string');
    });

    it('should throw an error if no "zipper" param presented', () => {
        const task = () => (
            <Zip of={['ids', 'friends']} as="fullfilledUsers">
                <Ids />
                <Friends />
            </Zip>
        );

        expect(task).toThrowError('no "zipper" key presented in Zip task');
    });

    it('should throw an error if "zipper" param has invalid type', () => {
        const task = () => (
            <Zip of={['ids', 'friends']} as="fullfilledUsers" zipper="hello">
                <Ids />
                <Friends />
            </Zip>
        );

        expect(task).toThrowError('"zipper" param presented in Zip task should be a function');
    });

    it('should throw an error if no keys found by "of" paths', () => {
        const task = (
            <Zip of={['ids', 'users']} as="fullfilledUsers" zipper={zipper}>
                <Ids />
                <Friends />
            </Zip>
        );

        expect(task.start()).rejects.toEqual('no "users" key presented in results of Zip task');
    });

    it('should throw an error if required propeties are not Arrays', () => {
        class WrongTask extends Task {
            do() {
                return Promise.resolve({
                    wrongKey: 'hello',
                });
            }
        }

        const task = (
            <Zip of={['ids', 'wrongKey']} as="fullfilledUsers" zipper={zipper}>
                <Ids />
                <WrongTask />
            </Zip>
        );

        expect(task.start()).rejects.toEqual('"wrongKey" key processed by Zip task is not an Array');
    });

    it('should correctly map the target properties to new array by given name', () => {
        const task = (
            <Zip of={['ids', 'users', 'friends']} as="fullfilledUsers" zipper={zipper}>
                <Ids />
                <Users />
                <Friends />
            </Zip>
        );

        expect(task.start()).resolves.toEqual({
            fullfilledUsers: [
                { id: 1, name: 'john', friends: [2, 3] },
                { id: 2, name: 'sarah', friends: [1, 3] },
                { id: 3, name: 'peter', friends: [1, 2] },
            ],
        });
    });
});
