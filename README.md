# x-task

[![Build Status](https://travis-ci.org/a-omsk/x-task.svg?branch=master)](https://travis-ci.org/a-omsk/x-task)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

Rethink async tasks with JSX and React style.

Write and compose your complex and domain async tasks via components and use common idioms from React community.
Works in any modern javascript environment that supports Promise.


### Install it

```
npm install x-task --save
```

### If you want to use jsx syntax
```
npm install --save-dev babel-plugin-transform-react-jsx
```

### Change default jsx pragma in your .babelrc if you don't use another jsx pragmas (like React, deku, h, etc.)
```json
{
  "plugins": [
      [
          "transform-react-jsx",
          {
              "pragma": "XTask.createTask"
          }
      ]
  ]
}
```

### If you want use it with another jsx libraries, just add it to top of your target file
```
/** @jsx XTask.createTask */
```

### And modify .babelrc
```json
{
  "plugins": ["transform-react-jsx"]
}
```



# And...

## Write your own tasks, sync or async.

```js
  import { Task } from 'x-task';

  class GetUser extends Task {
    do() {
      return fetch(`/api/users/${this.params.id}`);
    }
  }
```

## Compose your tasks with built-in tasks.

```js
import XTask, { Task, components } from 'x-task';
import { GetCurrentUser, GetUser, GetRecommendedUsers } from '...';

const { Merge, Either, Take } = components;

const task = (
  <Merge onResolve={onResolve}>
    <Either predicate={predicate}>
      <GetCurrentUser />
      <GetUser id={id} />
    </Either>
    <Take from="users" count={1}>
      <GetRecommendedUsers />
    </Take>
  </Merge>
);

task.start();
```


## Use powerful React idioms, such HOCs, etc.

```js
import XTask, { Task } from 'x-task';
import SomeTask from './SomeTask';

const withContext = (WrappedComponent) => {
    return class WithContext extends Task {
        getContext() {
            return "context";
        }

        do() {
            return (
                <WrappedComponent
                    {...this.params}
                    getContext={this.getContext.bind(this)}
                />
            );
        }
    };
};

const WrappedChild = withContext(SomeTask);

```

## Full API documentation

[Read them here](docs/API.md)
