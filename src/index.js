// @flow

import Task from './Task';
import Components from './components/index';

class XTask {
    static createTask(Constructor:Function, params:any, ...children:Array<Task>):Task {
        return new Constructor(params, children);
    }
}

export {
    Task,
    Components,
    XTask,
};

export default XTask;
