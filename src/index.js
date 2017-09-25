// @flow

import Task from './Task';
import components from './components';

import type { TaskParams, TaskChildren } from './Task';

class XTask {
    static createTask(Constructor:Function, params:TaskParams, ...children:TaskChildren):Task {
        return new Constructor(params, children);
    }
}

export {
    Task,
    XTask,
    components,
};

export default XTask;
