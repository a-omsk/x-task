// @flow

import ExportTask from './Task';
import ExportComponents from './components/index';

class Xpressive {
    static createTask(Constructor:Function, params:any, ...children:Array<ExportTask>):ExportTask {
        return new Constructor(params, children);
    }
}

export const Task = ExportTask;
export const Components = ExportComponents;

export default Xpressive;
