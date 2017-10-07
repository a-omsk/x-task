# About

XTask is just abstact Task class and some helpful utility tasks.

Think of Task as React.Component without view, only data processing.

You can create simple Task with this example:

```js
import { Task } from 'x-task';

class AnswerTask extends Task {
    do() {
        return Promise.resolve({ result: 42 });
    }
}
```

## Core props and methods of Task class:

### `task.params`
Same as this.props in React.

### `task.do()`

Looks the same as .render of React. Put the main task code here and return the result as a plain object*

### `task.start()`

Starts the task, resolve children tasks and performe .do() with children results

Results of all children tasks will be set to parent task as this.params;

# How to launch task?

```js
const task  = XTask.createTask(SomeTask, { id: 1 }, XTask.createTask(SomeChildren)); // without babel
```

same as

```js
const task = (
    <SomeTask id={1} >
        <SomeChildren />
    </SomeTask>
);
```

and then...

```js
task.start() // return Promise<Result>
```
## API Reference
* [XTask](#xtask)
  + [`createTask`](#createtask)
  + [`cloneTask`](#clonetask)
* [Components](#components)
  + [`Merge`](#merge)
  + [`Zip`](#zip)
  + [`Constant`](#constant)
  + [`Reject`](#reject)
  + [`Catch`](#catch)
  + [`Repeat`](#repeat)
  + [`Take`](#take)
  + [`Get`](#get)
  + [`Pick`](#pick)
  + [`Zip`](#zip)
  + [`Either`](#either)
  + [`Or`](#or)
  + [`Context`](#context)
  + [`Pipe`](#pipe)
  + [`Timeout`](#timeout)

## XTask

### `createTask()`

Create the task instance.

```js
XTask.createTask(SomeTask:TaskClass, params:Object, ...Children:Task):Task
```

### `cloneTask()`

Сlone already created task instance with new params / children.

```js
XTask.clone(TaskInstance:Task, params:Object, ...Children:Task):Task
```

## Components

### `Merge`

`Merge` task resolves all children and pass results to onResolve handler:

**Props:**
    `onResolve:Function = (obj:Result) => Result` - process the results of all children tasks

```js
import XTask, { Task, components } from 'x-task';
const { Merge } = components;

const onResolve = (results) => ({
    result: results.map(r => r.result).join(' '),
});

const task = (
    <Merge onResolve={onResolve:Function}>
        <GetHello />  // return { result: 'hello' }
        <GetThis />  // return { result: 'this' }
        <GetWorld />  // return { result: 'world' }
    </Merge>
);
```

### `Zip`

`Zip` task same the lodash zip() function. take the target arrays and combine in with zipper

**Props:**
    `of:Array<Key>` - array of target keys
    `as:string` - zip result name
    `zipper:Function = (...Array<Result<Key>>) => Result`

```js
import XTask, { Task, components } from 'x-task';
const { Zip } = components;

const zipper = (id, { name }, friends) => ({
    id,
    name,
    friends,
});

const task = (
    <Zip of={['ids', 'users', 'friends']} as="fullfilledUsers" zipper={zipper}>
        <Ids /> // return {ids:Array<Id>}
        <Users /> // return { users:Array<User> }
        <Friends /> // return { friends:Array<Array<Id>> }
    </Zip>
);
```

### `Constant`

`Constant` task always resolves the same value

**Props:**
    `name:string` - value name
    `value:any` - given value

```js
import XTask, { Task, components } from 'x-task';
const { Constant } = components;

const task = <Constant name="userId" value={42} />;
```

### `Reject`

`Reject` task always reject the same error

**Props:**
    `error:string | Error` - given error

```js
import XTask, { Task, components } from 'x-task';
const { Reject } = components;

class TestError extends Error {}

const task = <Reject error={TestError} />;
```

### `Catch`

`Catch` task is same the Promise.catch().

**Props:**
    `handler:Function = (e:Error) => Result` - error handler

```js
import XTask, { Task, components } from 'x-task';
const { Catch } = components;

const handler = () => ({ result: 42 });

const task = (
    <Catch handler={handler}>
        <ProblemTask /> // throws an error
    </Catch>
);
```

### `Repeat`

`Repeat` task repeat children task if it rejects.

**Props:**
    `times:number` - repeat count before whole reject

```js
import XTask, { Task, components } from 'x-task';
const { Repeat } = components;

const handler = () => ({ result: 42 });

const task = (
    <Repeat times={2}>
        <ProblemTask /> // throws an error twice
    </Repeat>
);
```

### `Take`

`Take` task take n elements from target array

**Props:**
    `from:Key` - target key (should be an array)
    `count:number` - count of element

```js
import XTask, { Task, components } from 'x-task';
const { Take } = components;

const task = (
    <Take from="someArray" count={3}>
        <SomeTask /> // return { someArray: [...] }
    </Take>
);
```
