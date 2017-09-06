// @flow

const Task = require('./Task');

class Xpressive {
    static Task:Function;

    static createTask(Constructor:Function, params:any, ...children:Array<Task>):Task {
        return new Constructor(params, children);
    }
}

Xpressive.Task = Task;

module.exports = Xpressive;
