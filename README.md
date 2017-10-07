# x-task (WIP)

[![Build Status](https://travis-ci.org/a-omsk/x-task.svg?branch=master)](https://travis-ci.org/a-omsk/x-task)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

Rethink async tasks with JSX and React style.

Write and compose your complex and domain async tasks via components and use common idioms from React community.
Works in any modern javascript environment that supports Promise.


### Install it

```
npm install x-task --save
```

### Change default jsx pragma in your .babelrc
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
import XTask, { Task } from 'x-task';

const task = (
  <Merge handler={handler}>
    <Either predicate={predicate}>
      <GetCurrentUser />
      <GetUser id={id} />
    </Either>
    <First from="users" count={1}>
      <GetRecommendedUsers />
    </First>
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
