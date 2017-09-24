// @flow

import Task from './Task';
import Components from './components/index';

import type { TaskParams, TaskChildren } from './Task';

class XTask {
    static createTask(Constructor:Function, params:TaskParams, ...children:TaskChildren):Task {
        return new Constructor(params, children);
    }
}

export {
    Task,
    Components,
    XTask,
};

export default XTask;
