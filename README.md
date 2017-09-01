# ngrx-enums
A small library that provides the base classes for for implementing @ngrx actions and reducers with ts-enums

## Motivation

[@ngrx/store](https://github.com/ngrx/store) is a very powerful utility for managing
the state of Angular apps, but some developers have criticized the [example app](https://github.com/ngrx/example-app)
for containing too much boilerplate (particularly in the action classes) and for having
large switch statements in the reducers. [ngrx-example-app-enums](https://github.com/LMFinney/ngrx-example-app-enums)
is a fork of the [example app](https://github.com/ngrx/example-app)
that uses [ts-enums](https://github.com/LMFinney/ts-enums) to encapsulate the actions and 
reducers, thereby reducing boilerplate and hiding the switch statement from view.

This library builds on [ts-enums](https://github.com/LMFinney/ts-enums) to provide
just the base files that [ngrx-example-app-enums](https://github.com/LMFinney/ngrx-example-app-enums)
uses so that they can be used separately in your apps.

## The basics

Install:

```text
npm install ngrx-enums
```

## Example
These examples are included in a [test](test/reducer.test.ts).

### Actions Defined via Enums
```typescript
import {ActionEnum, ActionEnumValue} from '../src/action-enum';

class LayoutAction<T> extends ActionEnumValue<T> {
  constructor(name: string) {
    super(name);
  }
}

class LayoutActionEnumType extends ActionEnum<LayoutAction<any>> {
  OPEN_SIDENAV: LayoutAction<void> =
    new LayoutAction<void>('[Layout] Open Sidenav');
  OPEN_SIDENAV_ALSO: LayoutAction<void> =
    new LayoutAction<void>('[Layout] Open Sidenav Also');
  SET_SIDENAV: LayoutAction<boolean> =
    new LayoutAction<boolean>('[Layout] Set Sidenav');

  constructor() {
    super();
    this.initEnum('layoutActions');
  }
}

const LayoutActionEnum: LayoutActionEnumType = new LayoutActionEnumType();
```

### Reducer Defined via `matches()` Methods
```typescript
import {TypedAction} from '../src/action-enum';
import {simplePropertyReducer} from '../src/reducer-enum';

interface State {
  showSidenav: boolean;
}

const initialState: State = {
  showSidenav: false
};

function layoutReducer(state = initialState, action: TypedAction<any>): State {
  if (LayoutActionEnum.matches(action,
      LayoutActionEnum.OPEN_SIDENAV, LayoutActionEnum.OPEN_SIDENAV_ALSO)) {
    // a simple reducer that always sets the same value
    // this shows how to respond to multiple actions
    // (fall-through in switch)
    return {...state, showSidenav: true};
  } else if (LayoutActionEnum.SET_SIDENAV.matches(action)) {
    // a reducer that accepts a value and copies it as a property into state
    return simplePropertyReducer<State, boolean>('showSidenav')(state, action);
  } else {
    return state;
  }
}
```

### Reducer Defined via Enums
```typescript
import {ActionEnumValue} from '../src/action-enum';
import {ReducerEnum, ReducerEnumValue, ReducerFunction, simplePropertyReducer} from '../src/reducer-enum';

interface State {
  showSidenav: boolean;
}

const initialState: State = {
  showSidenav: false
};

class LayoutReducer<T> extends ReducerEnumValue<State, T> {
  constructor(action: ActionEnumValue<T> | ActionEnumValue<T>[],
              reduce: ReducerFunction<State, T>) {
    super(action, reduce);
  }
}

class LayoutReducerEnumType extends ReducerEnum<LayoutReducer<any>, State> {
  // a simple reducer that always sets the same value
  // this shows how to respond to multiple actions
  // (fall-through in switch)
  OPEN_SIDENAV: LayoutReducer<void> =
    new LayoutReducer<void>([LayoutActionEnum.OPEN_SIDENAV,
        LayoutActionEnum.OPEN_SIDENAV_ALSO],
      (state: State) => ({showSidenav: true}));
  // a reducer that accepts a value and copies it as a property into state
  SET_SIDENAV: LayoutReducer<boolean> = new LayoutReducer<boolean>(
    LayoutActionEnum.SET_SIDENAV,
    simplePropertyReducer<State, boolean>('showSidenav')
  );

  constructor() {
    super(initialState);
    this.initEnum('layoutReducers');
  }
}

const LayoutReducerEnum: LayoutReducerEnumType = new LayoutReducerEnumType();
```

## More information

* Some users get an error that looks something like this when compiling:
 
   ```ERROR in Error encountered resolving symbol values statically. Calling function 'ɵmakeDecorator', function calls are not supported. Consider replacing the function or lambda with a reference to an exported function, resolving symbol Injectable...```
   
   If you get this error, you might be able to fix the problem by adding a path of ```"@angular/*": ["../node_modules/@angular/*"]``` 
   to your ```tsconfig.app.json``` file ([more information](https://github.com/angular/angular/issues/15767#issuecomment-308476202)).