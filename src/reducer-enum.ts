import {ActionReducer} from '@ngrx/store';
import {Enum, EnumValue} from 'ts-enums';

import {ActionEnumValue, TypedAction} from './action-enum';

export type ReducerFunction<S, T> = (state: S, action: TypedAction<T>) => S;

export function simplePropertyReducer<S, T>(
  propName: string
): ReducerFunction<S, T> {
  return (state: S, action: TypedAction<T>): S => {
    return Object.assign({}, state, {[propName]: action.payload});
  };
}

function extractDescriptions<T>(
  action: ActionEnumValue<T> | ActionEnumValue<T>[]
): string {
  if (Array.isArray(action)) {
    return action.map((value: ActionEnumValue<T>) => value.fullName).join(';');
  } else {
    return action.fullName;
  }
}

export abstract class ReducerEnumValue<S, T> extends EnumValue {
  readonly actions: ActionEnumValue<T>[];

  constructor(
    action: ActionEnumValue<T> | ActionEnumValue<T>[],
    private _reduce: ReducerFunction<S, T>
  ) {
    // if there's only one action value, use its fullName. Otherwise, concat
    // the fullName of all the action values.
    super(extractDescriptions(action));
    // accumulate the action types to check against when reducing
    this.actions = Array.isArray(action) ? action : [action];
  }

  get reduce(): ReducerFunction<S, T> {
    return this._reduce;
  }
}

export abstract class ReducerEnum<
  V extends ReducerEnumValue<S, any>,
  S
> extends Enum<V> {
  constructor(private initialState: S) {
    super();
  }

  reducer<T>(): ActionReducer<S> {
    // Find the appropriate enum instance for the action, if any, and return
    // its reducer.
    return (state: S = this.initialState, action: TypedAction<T>): S => {
      const reducerInstance: V | undefined = this.fromAction(action);
      return reducerInstance ? reducerInstance.reduce(state, action) : state;
    };
  }

  protected initEnum(name: string): void {
    super.initEnum(name);

    // ensure that each enum is used at most once per reducer
    const allActions: Set<ActionEnumValue<any>> = new Set();
    this.values.forEach((value: V) => {
      value.actions.forEach((action: ActionEnumValue<any>) => {
        if (allActions.has(action)) {
          const message = `Action ${
            action.fullName
          } is used multiple times in ${name} - this is not allowed`;
          throw new Error(message);
        } else {
          allActions.add(action);
        }
      });
    });
  }

  private fromAction(action: TypedAction<any>): V | undefined {
    // look through all of the reducer enum instances to find one that has the
    // current action in its array of actions
    return this.values.find((value: V) => {
      return value.actions.some(
        (type: ActionEnumValue<any>) => type.description === action.type
      );
    });
  }
}
